import type { APIRoute } from "astro";
import { getServiceSupabase } from "@/lib/supabase/server";
import { hashClientIp, isRateLimited, resolveClientIp } from "@/lib/survey/rateLimit";
import { parseSurveyPayload, type SurveyApiError } from "@/lib/survey/schema";

export const prerender = false;

function json(
  status: number,
  body: { ok: true; id: string } | { ok: false; error: SurveyApiError },
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json(400, { ok: false, error: "validation" });
  }

  const parsed = parseSurveyPayload(raw);
  if (!parsed.ok) {
    return json(400, { ok: false, error: "validation" });
  }

  const data = parsed.data;

  try {
    const supabase = getServiceSupabase();
    const ip = resolveClientIp(request, clientAddress);
    const ipHash = hashClientIp(ip);

    if (await isRateLimited(supabase, ipHash)) {
      return json(429, { ok: false, error: "rate_limited" });
    }

    const userAgent = request.headers.get("user-agent")?.slice(0, 300) ?? null;

    const { data: row, error } = await supabase
      .from("survey_kepuasan_pelanggan")
      .insert({
        nama: data.nama,
        tanggal_kunjungan: data.tanggal,
        layanan: data.layanan,
        rating_pendaftaran: data.ratings.pendaftaran,
        rating_keramahan: data.ratings.keramahan,
        rating_tunggu: data.ratings.tunggu,
        rating_dokter: data.ratings.dokter,
        rating_kebersihan: data.ratings.kebersihan,
        rating_keseluruhan: data.ratings.keseluruhan,
        nps: data.nps,
        saran: data.saran,
        consent: true,
        client_ip_hash: ipHash,
        user_agent: userAgent,
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("survey insert failed", error);
      return json(500, { ok: false, error: "server" });
    }

    return json(201, { ok: true, id: row.id as string });
  } catch (error) {
    console.error("survey submit failed", error);
    return json(500, { ok: false, error: "server" });
  }
};
