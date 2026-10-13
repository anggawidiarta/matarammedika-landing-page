import { getServiceSupabase } from "@/lib/supabase/server";
import { mapCmsRowToPublicItem } from "@/lib/cms/mapFeatureItem";
import type { CmsPublicItem } from "@/lib/cms/types";

export async function queryPublishedFeatures(
  contentType: "layanan" | "fasilitas",
): Promise<CmsPublicItem[]> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("cms_feature_items")
    .select("id, section, title, body, icon_kind, icon_name, icon_tone")
    .eq("content_type", contentType)
    .eq("is_published", true)
    .eq("is_deleted", false)
    .order("section", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((row) => mapCmsRowToPublicItem(row))
    .filter((item): item is CmsPublicItem => item !== null);
}
