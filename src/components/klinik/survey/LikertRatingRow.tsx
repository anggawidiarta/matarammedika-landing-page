import { likertOptionFace } from "./constants";

export default function LikertRatingRow({
  index,
  name,
  label,
  value,
  onChange,
}: {
  index: number;
  name: string;
  label: string;
  value: number | null;
  onChange: (next: number) => void;
}) {
  const answered = value != null;

  return (
    <fieldset className="p-4 min-w-0 to-white rounded-2xl border border-muted/15 bg-linear-to-br from-surface-tint/80 sm:p-5">
      <legend className="mb-4 flex w-full min-w-0 items-start gap-3 px-0 font-body text-sm font-medium leading-snug text-heading [overflow-wrap:anywhere] sm:text-[15px]">
        <span
          aria-hidden="true"
          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full font-body text-xs font-semibold ${
            answered
              ? "bg-gradient-blue-green text-white shadow-sm"
              : "bg-surface-highlight text-muted"
          }`}
        >
          {index}
        </span>
        <span className="min-w-0 pt-0.5">{label}</span>
      </legend>

      <div
        className="mx-auto w-full max-w-[22rem] min-w-0 sm:max-w-[26rem]"
        role="group"
        aria-label={`Skala kepuasan untuk ${label}`}
      >
        <div className="relative px-2 py-3 rounded-2xl bg-surface-highlight/50 sm:px-3">
          <div
            aria-hidden="true"
            className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 pointer-events-none bg-muted/20"
          />
          <div className="relative grid min-w-0 grid-cols-5 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5].map((score) => {
              const id = `${name}-${score}`;
              return (
                <label
                  key={score}
                  htmlFor={id}
                  className="flex flex-col gap-1 items-center min-w-0 cursor-pointer"
                >
                  <input
                    id={id}
                    className="sr-only peer"
                    type="radio"
                    name={name}
                    value={score}
                    checked={value === score}
                    onChange={() => onChange(score)}
                    aria-label={`${score} dari 5`}
                  />
                  <span className={likertOptionFace}>{score}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-2.5 grid min-w-0 grid-cols-5 gap-1.5 px-0.5 font-body text-[11px] leading-tight text-muted sm:gap-2 sm:text-xs">
          <span className="col-span-2 text-left">Sangat tidak puas</span>
          <span className="col-span-1" aria-hidden="true" />
          <span className="col-span-2 text-right">Sangat puas</span>
        </div>

        <p
          className={`mt-2 min-h-5 text-center font-body text-xs transition-opacity duration-200 ${
            answered ? "opacity-100 text-blue" : "text-transparent opacity-0"
          }`}
          aria-live="polite"
        >
          {answered ? `Anda memilih ${value} dari 5` : ""}
        </p>
      </div>
    </fieldset>
  );
}
