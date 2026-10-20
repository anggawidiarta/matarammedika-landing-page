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

export type ProfilUnit = "klinik" | "apotek";

export type ProfilContent = {
  about: string | null;
  vision: string | null;
  missions: string[];
};
