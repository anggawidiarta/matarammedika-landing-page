import type { IconDescriptor } from "@/types/feature";

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
