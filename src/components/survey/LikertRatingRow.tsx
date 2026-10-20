import { likertOptionFace } from "./formUi";

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
  const labelId = `${name}-label`;
  const answered = value != null;

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      className="border-muted/15 flex min-w-0 flex-col gap-3 py-4 first:pt-0 last:pb-0 not-last:border-b lg:flex-row lg:items-center lg:justify-between lg:gap-6"
    >
      <div
        id={labelId}
        className="font-body text-heading flex min-w-0 items-start gap-3 text-sm leading-snug font-medium [overflow-wrap:anywhere] sm:text-base"
      >
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
      </div>

      <div className="grid w-full min-w-0 grid-cols-5 gap-1 sm:gap-2 lg:w-[252px] lg:shrink-0">
        {[1, 2, 3, 4, 5].map((score) => {
          const id = `${name}-${score}`;
          return (
            <label key={score} htmlFor={id} className="flex min-w-0 cursor-pointer justify-center">
              <input
                id={id}
                className="peer sr-only"
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
  );
}
