import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SmallIcon } from "@/components/kelola/featureIcon";
import { inputClass } from "@/components/kelola/ui/Field";
import { ICON_LABELS, KLINIK_ICON_NAMES } from "@/lib/kelola/constants";
import type { KlinikLucideName } from "@/types/feature";

type IconPickerProps = {
  value: KlinikLucideName;
  onChange: (name: KlinikLucideName) => void;
};

/** Native radios give one tab stop and arrow-key navigation without extra scripting. */
export default function IconPicker({ value, onChange }: IconPickerProps) {
  const groupName = useId();
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return KLINIK_ICON_NAMES;
    return KLINIK_ICON_NAMES.filter(
      (name) =>
        ICON_LABELS[name].toLowerCase().includes(needle) || name.toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="text-sm font-semibold">Ikon</span>
        <p className="text-heading/70 text-[13px] leading-5" aria-live="polite">
          Terpilih: <span className="text-heading font-medium">{ICON_LABELS[value]}</span>
        </p>
      </div>
      <div className="relative">
        <Search
          size={18}
          aria-hidden
          className="text-heading/60 pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
        />
        <input
          type="search"
          aria-label="Cari ikon"
          placeholder="Cari ikon, misalnya gigi atau mata"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={`${inputClass} pl-10`}
        />
      </div>

      <fieldset className="m-0 border-0 p-0">
        <legend className="sr-only">Pilih ikon</legend>
        {visible.length === 0 ? (
          <p className="text-heading/80 py-3 text-sm">
            Tidak ada ikon yang cocok dengan pencarian.
          </p>
        ) : (
          <div className="grid max-h-44 grid-cols-5 gap-1 overflow-y-auto overscroll-contain p-1 sm:grid-cols-8">
            {visible.map((name) => (
              <label key={name} className="relative block">
                <input
                  type="radio"
                  name={groupName}
                  value={name}
                  checked={value === name}
                  onChange={() => onChange(name)}
                  className="peer sr-only"
                />
                <span
                  title={ICON_LABELS[name]}
                  className="peer-checked:bg-surface-highlight peer-checked:ring-blue peer-focus-visible:outline-blue hover:bg-surface-tint flex min-h-12 cursor-pointer flex-col items-center justify-center rounded-lg p-1 ring-1 ring-transparent transition-colors duration-150 peer-checked:ring-2 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 motion-reduce:transition-none"
                >
                  <SmallIcon descriptor={{ kind: "lucide", name }} size={30} />
                  <span className="sr-only">{ICON_LABELS[name]}</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}
