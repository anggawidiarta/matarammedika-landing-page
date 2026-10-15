import { queryPublishedFeatures } from "@/lib/cms/queryPublishedFeatures";
import type { CmsPublicItem } from "@/lib/cms/types";

type ContentType = "layanan" | "fasilitas";

const TTL_MS = 60_000;
const cache = new Map<ContentType, { at: number; items: CmsPublicItem[] | null }>();

/** Server-side CMS load for Astro pages; returns null on failure so callers use fallbacks. Memoized briefly per process. */
export async function loadPublishedFeatures(
  contentType: ContentType,
): Promise<CmsPublicItem[] | null> {
  const hit = cache.get(contentType);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.items;

  try {
    const result = await queryPublishedFeatures(contentType);
    const items = result.length > 0 ? result : null;
    cache.set(contentType, { at: Date.now(), items });
    return items;
  } catch (error) {
    console.error(`[cms] loadPublishedFeatures(${contentType})`, error);
    return hit?.items ?? null;
  }
}
