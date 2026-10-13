import { LIKERT, NAMA_MAX, SARAN_MAX, LAYANAN_VALUES } from "@/lib/survey/constants";

export { LIKERT, NAMA_MAX, SARAN_MAX };
export type { LikertKey } from "@/lib/survey/constants";

export const REQUIRED_COUNT = LIKERT.length + 1;

export const LAYANAN_OPTIONS = LAYANAN_VALUES;

export type Ratings = Record<(typeof LIKERT)[number]["key"], number | null>;
export type FormStatus = "idle" | "loading" | "error" | "success";

export const emptyRatings = (): Ratings =>
  Object.fromEntries(LIKERT.map((item) => [item.key, null])) as Ratings;

export const fieldClass =
  "w-full min-w-0 rounded-2xl border border-muted/30 bg-surface-tint px-4 py-3 font-body text-sm text-heading outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export const radioFace =
  "flex h-10 w-full min-w-0 items-center justify-center rounded-full border border-muted/40 bg-white text-sm font-semibold text-heading transition-[border-color,background-color,opacity] duration-200 ease-out peer-hover:border-blue peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue peer-checked:border-blue peer-checked:bg-surface-highlight peer-checked:text-blue";

export const likertOptionFace =
  "flex aspect-square w-full max-w-[3.25rem] items-center justify-center justify-self-center rounded-2xl border border-muted/30 bg-white font-body text-base font-semibold text-heading shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out peer-hover:border-blue/70 peer-hover:bg-surface-highlight/60 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue peer-checked:border-blue peer-checked:bg-surface-highlight peer-checked:text-blue peer-checked:shadow-float peer-active:scale-[0.96] motion-reduce:transition-none motion-reduce:peer-active:scale-100";
