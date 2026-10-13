import type { CmsPublicItem, FeatureItem } from "@/lib/cms/types";

export function toFeatureItem(item: CmsPublicItem): FeatureItem {
  return {
    title: item.title,
    body: item.body,
    icon: item.icon,
  };
}

/** Prefer CMS section items; fall back when empty, missing, or query failed. */
export function itemsForSection(
  items: CmsPublicItem[] | null | undefined,
  section: string,
  fallback: FeatureItem[],
): FeatureItem[] {
  if (!items?.length) return fallback;
  const sectionItems = items.filter((item) => item.section === section).map(toFeatureItem);
  return sectionItems.length > 0 ? sectionItems : fallback;
}
