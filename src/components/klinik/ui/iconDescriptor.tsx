import type { ReactNode } from "react";
import CircleIcon from "@/components/klinik/ui/CircleIcon";
import {
  klinikLucideIcons,
  type KlinikLucideName,
} from "@/components/klinik/ui/lucideMap";
import type { CircleTone } from "@/components/klinik/ui/circleTone";

export type IconDescriptor =
  | { kind: "lucide"; name: KlinikLucideName }
  | { kind: "lucideCircle"; name: KlinikLucideName; tone: CircleTone };

export function renderIcon(descriptor: IconDescriptor): ReactNode {
  if (descriptor.kind === "lucideCircle") {
    return <CircleIcon name={descriptor.name} tone={descriptor.tone} />;
  }

  const Icon = klinikLucideIcons[descriptor.name];

  return (
    <span className="inline-flex justify-center items-center size-20 shrink-0">
      <Icon size={48} className="text-blue" aria-hidden strokeWidth={1.75} />
    </span>
  );
}
