import type { IconDescriptor } from "@/components/shared/ui";
import type { CircleTone } from "@/components/shared/ui/circleTone";
import { klinikLucideIcons, type KlinikLucideName } from "@/components/shared/ui/lucideMap";
import type { CmsPublicIcon, CmsPublicItem } from "@/lib/cms/types";

const CIRCLE_TONES = new Set<CircleTone>(["blue", "green", "pink", "lilac", "mint", "red"]);

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
  return name in klinikLucideIcons;
}

function isCircleTone(tone: string): tone is CircleTone {
  return CIRCLE_TONES.has(tone as CircleTone);
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

export function toIconDescriptor(icon: CmsPublicIcon): IconDescriptor {
  if (icon.kind === "lucideCircle") {
    return { kind: "lucideCircle", name: icon.name, tone: icon.tone };
  }
  return { kind: "lucide", name: icon.name };
}
