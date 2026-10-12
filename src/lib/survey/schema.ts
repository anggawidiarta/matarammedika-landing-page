import { z } from "zod";
import {
  LAYANAN_VALUES,
  NAMA_MAX,
  SARAN_MAX,
  type SurveyPayload,
} from "./constants";

export type { SurveyApiError, SurveyPayload } from "./constants";

const rating = z.number().int().min(1).max(5);

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
    .refine(
      (value) => value === null || !Number.isNaN(Date.parse(`${value}T00:00:00Z`)),
      { message: "invalid_date" },
    ),
);

export const surveyPayloadSchema = z.object({
  nama: optionalTrimmed(NAMA_MAX),
  tanggal: optionalTanggal,
  layanan: z.enum(LAYANAN_VALUES),
  ratings: z.object({
    pendaftaran: rating,
    keramahan: rating,
    tunggu: rating,
    dokter: rating,
    kebersihan: rating,
    keseluruhan: rating,
  }),
  nps: z.number().int().min(0).max(10),
  saran: optionalTrimmed(SARAN_MAX),
  consent: z.literal(true),
});

export function parseSurveyPayload(
  input: unknown,
): { ok: true; data: SurveyPayload } | { ok: false; error: z.ZodError } {
  const result = surveyPayloadSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data as SurveyPayload };
  }
  return { ok: false, error: result.error };
}
