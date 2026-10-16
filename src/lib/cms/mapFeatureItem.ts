import type { CmsPublicIcon, CmsPublicItem } from "@/lib/cms/types";
import {
  CIRCLE_TONES,
  KLINIK_ICON_NAMES,
  type CircleTone,
  type KlinikLucideName,
} from "@/types/feature";

type CmsRow = {
  id: string;
  section: string;
  title: string;
  body: string;
  data: unknown;
};

type RawIcon = { kind?: unknown; name?: unknown; tone?: unknown };

function readIcon(data: unknown): RawIcon | null {
  if (typeof data !== "object" || data === null) return null;
  const icon = (data as { icon?: unknown }).icon;
  return typeof icon === "object" && icon !== null ? (icon as RawIcon) : null;
}

function isLucideName(name: unknown): name is KlinikLucideName {
  if (typeof name !== "string") return false;
  return (KLINIK_ICON_NAMES as readonly string[]).includes(name);
}

function isCircleTone(tone: unknown): tone is CircleTone {
  if (typeof tone !== "string") return false;
  return (CIRCLE_TONES as readonly string[]).includes(tone);
}

export function mapCmsRowToPublicItem(row: CmsRow): CmsPublicItem | null {
  const raw = readIcon(row.data);
  if (!raw || !isLucideName(raw.name)) return null;

  let icon: CmsPublicIcon;
  if (raw.kind === "lucideCircle") {
    if (!isCircleTone(raw.tone)) return null;
    icon = { kind: "lucideCircle", name: raw.name, tone: raw.tone };
  } else if (raw.kind === "lucide") {
    icon = { kind: "lucide", name: raw.name };
  } else {
    return null;
  }

  return {
    id: row.id,
    section: row.section,
    title: row.title,
    body: row.body,
    icon,
  };
}
