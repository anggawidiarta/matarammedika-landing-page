import type { IconDescriptor } from "@/components/shared/ui/iconDescriptor";

/** Display card shape shared by layanan / fasilitas fallbacks and CMS-mapped items. */
export type FeatureItem = {
  title: string;
  body: string;
  icon: IconDescriptor;
};

export type CmsPublicIcon = IconDescriptor;

export type CmsPublicItem = {
  id: string;
  section: string;
  title: string;
  body: string;
  icon: CmsPublicIcon;
};

export type CmsPublicResponse =
  | { ok: true; items: CmsPublicItem[] }
  | { ok: false; error: "server" };
