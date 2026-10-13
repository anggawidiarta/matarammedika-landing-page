import type { CmsPublicItem, CmsPublicResponse } from "@/lib/cms/types";

export async function fetchPublicFeatures(
  path: "/api/public/layanan" | "/api/public/fasilitas",
): Promise<CmsPublicItem[]> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`CMS API ${path} failed with ${response.status}`);
  }

  const payload = (await response.json()) as CmsPublicResponse;
  if (!payload.ok) {
    throw new Error(`CMS API ${path} returned error`);
  }

  return payload.items;
}
