import type { CircleTone } from "@/components/shared/ui/circleTone";
import type { KlinikLucideName } from "@/components/shared/ui/lucideMap";

export type CmsPublicIcon =
  | { kind: "lucide"; name: KlinikLucideName }
  | { kind: "lucideCircle"; name: KlinikLucideName; tone: CircleTone };

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
