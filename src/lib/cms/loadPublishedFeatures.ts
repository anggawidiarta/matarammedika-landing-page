import { queryPublishedFeatures } from "@/lib/cms/queryPublishedFeatures";
import { ttlCached } from "@/lib/cms/ttlCache";
import type { CmsPublicItem } from "@/lib/cms/types";

type ContentType = "layanan" | "fasilitas";

const loaders: Record<ContentType, () => Promise<CmsPublicItem[] | null>> = {
  layanan: ttlCached("loadPublishedFeatures(layanan)", () => queryPublishedFeatures("layanan")),
  fasilitas: ttlCached("loadPublishedFeatures(fasilitas)", () =>
    queryPublishedFeatures("fasilitas"),
  ),
};

/** Server-side CMS load for Astro pages; returns null on failure so callers use fallbacks. Memoized briefly per process. */
export function loadPublishedFeatures(contentType: ContentType): Promise<CmsPublicItem[] | null> {
  return loaders[contentType]();
}
