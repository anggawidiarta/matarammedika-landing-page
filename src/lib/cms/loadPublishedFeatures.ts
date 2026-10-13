import { queryPublishedFeatures } from "@/lib/cms/queryPublishedFeatures";
import type { CmsPublicItem } from "@/lib/cms/types";

/** Server-side CMS load for Astro pages; returns null on failure so callers use fallbacks. */
export async function loadPublishedFeatures(
  contentType: "layanan" | "fasilitas",
): Promise<CmsPublicItem[] | null> {
  try {
    const items = await queryPublishedFeatures(contentType);
    return items.length > 0 ? items : null;
  } catch (error) {
    console.error(`[cms] loadPublishedFeatures(${contentType})`, error);
    return null;
  }
}
