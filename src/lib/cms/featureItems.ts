import type { CmsPublicItem } from "@/lib/cms/types";
import type { FeatureItem } from "@/types/feature";

export function toFeatureItem(item: CmsPublicItem): FeatureItem {
  return {
    title: item.title,
    body: item.body,
    icon: item.icon,
  };
}

export function itemsForSection(
  items: CmsPublicItem[] | null | undefined,
  section: string,
): FeatureItem[] {
  return (items ?? []).filter((item) => item.section === section).map(toFeatureItem);
}
