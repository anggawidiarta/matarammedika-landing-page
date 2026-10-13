import type { APIRoute } from "astro";
import { queryPublishedFeatures } from "@/lib/cms/queryPublishedFeatures";
import type { CmsPublicResponse } from "@/lib/cms/types";

export const prerender = false;

function json(status: number, body: CmsPublicResponse) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async () => {
  try {
    const items = await queryPublishedFeatures("fasilitas");
    return json(200, { ok: true, items });
  } catch (error) {
    console.error("[api/public/fasilitas]", error);
    return json(500, { ok: false, error: "server" });
  }
};
