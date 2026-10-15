import { PUBLIC_CACHE_CONTROL, jsonResponse } from "@/lib/http";
import { queryPublishedFeatures } from "@/lib/cms/queryPublishedFeatures";
import type { CmsPublicResponse } from "@/lib/cms/types";

export async function publicFeaturesResponse(
  contentType: "layanan" | "fasilitas",
  logLabel: string,
): Promise<Response> {
  try {
    const items = await queryPublishedFeatures(contentType);
    const body: CmsPublicResponse = { ok: true, items };
    return jsonResponse(200, body, { "Cache-Control": PUBLIC_CACHE_CONTROL });
  } catch (error) {
    console.error(logLabel, error);
    const body: CmsPublicResponse = { ok: false, error: "server" };
    return jsonResponse(500, body);
  }
}
