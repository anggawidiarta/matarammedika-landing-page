import type { KeyboardEvent } from "react";
import { gradientBg } from "@/components/shared/ui/gradient";

export type SegmentedUnit = "klinik" | "apotek";

function unitForKey(key: string, active: SegmentedUnit): SegmentedUnit | null {
  if (key === "Home") return "klinik";
  if (key === "End") return "apotek";
  if (key === "ArrowLeft" || key === "ArrowRight") return active === "klinik" ? "apotek" : "klinik";
  return null;
}

export default function Segmented({
  active,
  onChange,
  panelId,
}: {
  active: SegmentedUnit;
  onChange?: (next: SegmentedUnit) => void;
  panelId?: string;
}) {
  const item =
    "relative flex h-8 w-20 items-center justify-center font-body text-base leading-6 transition-[color,background-color,border-color,transform] duration-200 ease-out before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[''] active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100";

  const klinikActive = active === "klinik";
  const apotekActive = active === "apotek";

  if (!onChange) {
    return (
      <div className="flex h-8 shrink-0" aria-hidden>
        <span
          className={`${item} rounded-l-[14px] ${
            klinikActive ? `text-white ${gradientBg}` : "border-muted text-muted border"
          }`}
        >
          Klinik
        </span>
        <span
          className={`${item} rounded-r-[14px] ${
            apotekActive ? `text-white ${gradientBg}` : "border-muted text-muted border border-l-0"
          }`}
        >
          Apotek
        </span>
      </div>
    );
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = unitForKey(event.key, active);
    if (!next) return;
    event.preventDefault();
    onChange(next);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-unit="${next}"]`)?.focus();
  };

  return (
    <div
      className="flex h-8 shrink-0"
      role="tablist"
      aria-label="Pilih unit Mataram Medika"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        role="tab"
        aria-selected={klinikActive}
        aria-controls={panelId}
        data-unit="klinik"
        tabIndex={klinikActive ? 0 : -1}
        className={`${item} focus-visible:outline-blue cursor-pointer rounded-l-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 ${
          klinikActive ? `text-white ${gradientBg}` : "border-muted text-muted border"
        }`}
        onClick={() => onChange("klinik")}
      >
        Klinik
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={apotekActive}
        aria-controls={panelId}
        data-unit="apotek"
        tabIndex={apotekActive ? 0 : -1}
        className={`${item} focus-visible:outline-blue cursor-pointer rounded-r-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 ${
          apotekActive ? `text-white ${gradientBg}` : "border-muted text-muted border border-l-0"
        }`}
        onClick={() => onChange("apotek")}
      >
        Apotek
      </button>
    </div>
  );
}
