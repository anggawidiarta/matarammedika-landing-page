import { parseSurveyPayload, type SurveyPayload } from "@/lib/survey/schema";
import type { Ratings } from "./formUi";

/** Payload keys double as the form fields a validation error can point at. */
export type SurveyFieldError = keyof SurveyPayload;

export type ClientValidationResult =
  | { ok: true; data: SurveyPayload }
  | { ok: false; field: SurveyFieldError; ratingKey?: string };

export type SurveyFormValues = {
  nama: string;
  tanggal: string;
  layanan: string;
  ratings: Ratings;
  nps: number | null;
  saran: string;
  consent: boolean;
};

/** Validates raw form state with the same zod schema the API uses; reports the first failing field. */
export function validateSurveyClient(values: SurveyFormValues): ClientValidationResult {
  const parsed = parseSurveyPayload(values);
  if (parsed.ok) return { ok: true, data: parsed.data };

  const [field, ratingKey] = parsed.error.issues[0].path;
  return {
    ok: false,
    field: field as SurveyFieldError,
    ratingKey: field === "ratings" ? String(ratingKey) : undefined,
  };
}
