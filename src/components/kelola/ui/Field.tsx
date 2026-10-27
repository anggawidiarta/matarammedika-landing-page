import { useId, type ReactNode } from "react";

export const inputClass =
  "block min-h-11 w-full rounded-lg border border-muted/30 bg-surface-tint px-3.5 py-2 font-body text-base text-heading transition-[border-color,box-shadow] duration-200 ease-out placeholder:text-heading/60 hover:border-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue aria-[invalid=true]:border-danger disabled:opacity-60 motion-reduce:transition-none";

export type ControlProps = {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  "aria-required": true | undefined;
};

type FieldProps = {
  label: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
  children: (control: ControlProps) => ReactNode;
};

export default function Field({ label, error, hint, required, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <label htmlFor={id} className="text-heading text-sm font-semibold">
          {label}
          {required && <span className="text-heading/70 font-normal"> (wajib)</span>}
        </label>
        {hint && (
          <p id={hintId} className="text-heading/70 text-[13px] leading-5 tabular-nums">
            {hint}
          </p>
        )}
      </div>
      {children({
        id,
        "aria-describedby": describedBy || undefined,
        "aria-invalid": error ? true : undefined,
        "aria-required": required ? true : undefined,
      })}
      {error && (
        <p id={errorId} role="alert" className="text-danger text-sm leading-5 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
