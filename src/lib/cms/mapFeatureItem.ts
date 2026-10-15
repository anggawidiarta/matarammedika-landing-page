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
  icon_kind: string;
  icon_name: string;
  icon_tone: string | null;
};

function isLucideName(name: string): name is KlinikLucideName {
  return (KLINIK_ICON_NAMES as readonly string[]).includes(name);
}

function isCircleTone(tone: string): tone is CircleTone {
  return (CIRCLE_TONES as readonly string[]).includes(tone);
}

export function mapCmsRowToPublicItem(row: CmsRow): CmsPublicItem | null {
  if (!isLucideName(row.icon_name)) return null;

  let icon: CmsPublicIcon;
  if (row.icon_kind === "lucideCircle") {
    if (!row.icon_tone || !isCircleTone(row.icon_tone)) return null;
    icon = { kind: "lucideCircle", name: row.icon_name, tone: row.icon_tone };
  } else if (row.icon_kind === "lucide") {
    icon = { kind: "lucide", name: row.icon_name };
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
