const UNITS = [
  { unit: "day", label: "Hari" },
  { unit: "hour", label: "Jam" },
  { unit: "minute", label: "Menit" },
  { unit: "second", label: "Detik" },
] as const;

/** Static markup; `src/scripts/promoCountdown.ts` fills in the digits in the browser. */
export default function PromoCountdown({ endsAt, urgent }: { endsAt: number; urgent: boolean }) {
  const tone = urgent ? "bg-promo/10 text-promo" : "bg-surface-highlight text-blue";
  const dot = urgent ? "bg-promo" : "bg-blue";

  return (
    <div data-promo-countdown data-ends-at={endsAt} className="flex flex-col gap-2">
      <p
        data-countdown-live
        className={`flex items-center gap-2 font-accent text-xs font-semibold uppercase tracking-wide ${urgent ? "text-promo" : "text-blue"}`}
      >
        <span className="relative flex size-2" aria-hidden>
          <span className={`absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping ${dot}`} />
          <span className={`relative inline-flex size-2 rounded-full ${dot}`} />
        </span>
        {urgent ? "Segera berakhir" : "Promo berakhir dalam"}
      </p>
      <div data-countdown-live role="timer" className="grid grid-cols-4 gap-2">
        {UNITS.map(({ unit, label }) => (
          <div key={unit} className={`flex min-w-0 flex-col items-center rounded-lg py-1.5 ${tone}`}>
            <span
              data-unit={unit}
              className="font-accent text-xl font-semibold leading-none tabular-nums"
            >
              --
            </span>
            <span className="mt-0.5 font-body text-[10px] font-medium opacity-80">{label}</span>
          </div>
        ))}
      </div>
      <p
        data-countdown-ended
        hidden
        className="rounded-xl bg-surface-tint px-4 py-3 text-center font-body text-sm font-medium text-muted"
      >
        Promo ini baru saja berakhir
      </p>
    </div>
  );
}
