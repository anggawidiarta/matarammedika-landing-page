import { gradientBg } from "@/components/shared/data/constants";

export type SegmentedUnit = "klinik" | "apotek";

export default function Segmented({
  active,
  onChange,
}: {
  active: SegmentedUnit;
  onChange?: (next: SegmentedUnit) => void;
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
            klinikActive ? `text-white ${gradientBg}` : "border border-muted text-muted"
          }`}
        >
          Klinik
        </span>
        <span
          className={`${item} rounded-r-[14px] ${
            apotekActive ? `text-white ${gradientBg}` : "border border-l-0 border-muted text-muted"
          }`}
        >
          Apotek
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-8 shrink-0" role="tablist" aria-label="Pilih unit Mataram Medika">
      <button
        type="button"
        role="tab"
        aria-selected={klinikActive}
        tabIndex={klinikActive ? 0 : -1}
        className={`${item} cursor-pointer rounded-l-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${
          klinikActive ? `text-white ${gradientBg}` : "border border-muted text-muted"
        }`}
        onClick={() => onChange("klinik")}
      >
        Klinik
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={apotekActive}
        tabIndex={apotekActive ? 0 : -1}
        className={`${item} cursor-pointer rounded-r-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${
          apotekActive ? `text-white ${gradientBg}` : "border border-l-0 border-muted text-muted"
        }`}
        onClick={() => onChange("apotek")}
      >
        Apotek
      </button>
    </div>
  );
}
