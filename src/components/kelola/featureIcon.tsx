import { circleToneClass } from "@/components/shared/ui/circleTone";
import { klinikLucideIcons } from "@/components/shared/ui/lucideMap";
import { CIRCLE_TONES, KLINIK_ICON_NAMES } from "@/lib/kelola/constants";
import type { CircleTone, IconDescriptor, KlinikLucideName } from "@/types/feature";

export const TONE_LABELS: Record<CircleTone, string> = {
  blue: "Biru",
  green: "Hijau",
  pink: "Biru muda",
  lilac: "Ungu",
  mint: "Hijau muda",
  red: "Merah",
};

function isIconName(value: unknown): value is KlinikLucideName {
  return typeof value === "string" && (KLINIK_ICON_NAMES as readonly string[]).includes(value);
}

function isTone(value: unknown): value is CircleTone {
  return typeof value === "string" && (CIRCLE_TONES as readonly string[]).includes(value);
}

/** Rows come from jsonb, so the icon is rebuilt only from values the public site can render. */
export function readIcon(data: Record<string, unknown>): IconDescriptor | null {
  const icon = data.icon as { kind?: unknown; name?: unknown; tone?: unknown } | undefined;
  if (!icon || !isIconName(icon.name)) return null;
  if (icon.kind === "lucideCircle" && isTone(icon.tone)) {
    return { kind: "lucideCircle", name: icon.name, tone: icon.tone };
  }
  return icon.kind === "lucide" ? { kind: "lucide", name: icon.name } : null;
}

export function SmallIcon({
  descriptor,
  size = 40,
}: {
  descriptor: IconDescriptor | null;
  size?: number;
}) {
  if (!descriptor)
    return (
      <span aria-hidden className="inline-block shrink-0" style={{ width: size, height: size }} />
    );
  const Icon = klinikLucideIcons[descriptor.name];
  const tone = descriptor.kind === "lucideCircle" ? circleToneClass[descriptor.tone] : null;
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${tone?.bg ?? ""}`}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.55} strokeWidth={1.75} className={tone?.fg ?? "text-blue"} />
    </span>
  );
}
