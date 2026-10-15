import { z } from "zod";
import { LAYANAN_VALUES, LIKERT, NAMA_MAX, SARAN_MAX } from "./constants";
import { isValidCalendarDate } from "./date";

export type { SurveyApiError } from "./constants";

const rating = z.number().int().min(1).max(5);

const ratingsShape = Object.fromEntries(LIKERT.map((item) => [item.key, rating])) as Record<
  (typeof LIKERT)[number]["key"],
  typeof rating
>;

const optionalTrimmed = (max: number) =>
  z.preprocess((value) => {
    if (value == null || value === "") return null;
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }, z.string().max(max).nullable());

const optionalTanggal = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .refine((value) => value === null || isValidCalendarDate(value), {
      message: "invalid_date",
    }),
);

export const surveyPayloadSchema = z.object({
  nama: optionalTrimmed(NAMA_MAX),
  tanggal: optionalTanggal,
  layanan: z.enum(LAYANAN_VALUES),
  ratings: z.object(ratingsShape),
  nps: z.number().int().min(0).max(10),
  saran: optionalTrimmed(SARAN_MAX),
  consent: z.literal(true),
});

/** Single source of truth for the payload shape: server and client both validate with this schema. */
export type SurveyPayload = z.output<typeof surveyPayloadSchema>;

export function parseSurveyPayload(
  input: unknown,
): { ok: true; data: SurveyPayload } | { ok: false; error: z.ZodError } {
  const result = surveyPayloadSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return { ok: false, error: result.error };
}
