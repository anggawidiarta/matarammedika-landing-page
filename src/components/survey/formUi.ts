import { LIKERT } from "@/lib/survey/constants";

export const REQUIRED_COUNT = LIKERT.length + 1;

export type Ratings = Record<(typeof LIKERT)[number]["key"], number | null>;
export type FormStatus = "idle" | "loading" | "error" | "success";

export const emptyRatings = (): Ratings =>
  Object.fromEntries(LIKERT.map((item) => [item.key, null])) as Ratings;

const pad = (n: number) => String(n).padStart(2, "0");

/** Local-calendar `YYYY-MM-DD`, the format the date picker and API use. */
export const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fieldClass =
  "w-full min-w-0 rounded-2xl min-h-12 border border-muted/30 bg-surface-tint px-4 py-3 font-body text-sm text-heading outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export const radioFace =
  "flex h-10 w-full min-w-0 items-center justify-center rounded-full border border-muted/40 bg-white text-sm font-semibold text-heading transition-[border-color,background-color,opacity] duration-200 ease-out peer-hover:border-blue peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue peer-checked:border-blue peer-checked:bg-surface-highlight peer-checked:text-blue";

export const likertOptionFace =
  "flex aspect-square w-full max-w-[3.25rem] items-center justify-center justify-self-center rounded-2xl border border-muted/30 bg-white font-body text-base font-semibold text-heading shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out peer-hover:border-blue/70 peer-hover:bg-surface-highlight/60 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue peer-checked:border-blue peer-checked:bg-surface-highlight peer-checked:text-blue peer-checked:shadow-float peer-active:scale-[0.96] motion-reduce:transition-none motion-reduce:peer-active:scale-100";

/** Button face shared by the custom select and date picker triggers. */
export const triggerClass = (invalid: boolean, open: boolean) =>
  `flex min-h-12 w-full min-w-0 items-center justify-between gap-3 rounded-2xl border bg-surface-tint px-4 py-3 text-left font-body text-sm text-heading shadow-[0_0_0_1px_oklch(0_0_0/0.04),0_1px_2px_-1px_oklch(0_0_0/0.05)] outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${
    invalid
      ? "border-promo focus-visible:outline-promo"
      : open
        ? "border-blue/50 hover:border-muted/50"
        : "border-muted/30 hover:border-muted/50"
  }`;
