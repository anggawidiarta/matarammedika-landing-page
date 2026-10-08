import { klinikLucideIcons, type KlinikLucideName } from "@/components/klinik/ui/lucideMap";
import { circleToneClass, type CircleTone } from "@/components/klinik/ui/circleTone";

export default function CircleIcon({
  name,
  tone,
  iconSize = 40,
}: {
  name: KlinikLucideName;
  tone: CircleTone;
  iconSize?: number;
}) {
  const Icon = klinikLucideIcons[name];
  const { bg, fg } = circleToneClass[tone];

  return (
    <span
      className={`inline-flex size-20 shrink-0 items-center justify-center rounded-full ${bg}`}
    >
      <Icon size={iconSize} className={fg} aria-hidden strokeWidth={1.75} />
    </span>
  );
}
