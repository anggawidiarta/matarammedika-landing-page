import { queryPublishedFeatures } from "@/lib/cms/queryPublishedFeatures";
import type { CmsPublicResponse } from "@/lib/cms/types";

function json(status: number, body: CmsPublicResponse) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function publicFeaturesResponse(
  contentType: "layanan" | "fasilitas",
  logLabel: string,
): Promise<Response> {
  try {
    const items = await queryPublishedFeatures(contentType);
    return json(200, { ok: true, items });
  } catch (error) {
    console.error(logLabel, error);
    return json(500, { ok: false, error: "server" });
  }
}
