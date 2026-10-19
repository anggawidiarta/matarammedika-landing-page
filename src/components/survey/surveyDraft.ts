import {
  LAYANAN_VALUES,
  LIKERT,
  NAMA_MAX,
  SARAN_MAX,
} from "@/lib/survey/constants";
import { emptyRatings, type Ratings } from "./formUi";

const STORAGE_KEY = "survey-kepuasan-draft";

export type SurveyDraft = {
  nama: string;
  tanggal: string;
  layanan: string;
  ratings: Ratings;
  nps: number | null;
  saran: string;
};

const isScore = (value: unknown, min: number, max: number): value is number =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= max;

const asText = (value: unknown, max: number) =>
  typeof value === "string" ? value.slice(0, max) : "";

/** Storage content is user-editable, so every field is re-validated instead of trusted. */
function parseDraft(raw: unknown): SurveyDraft | null {
  if (typeof raw !== "object" || raw === null) return null;
  const data = raw as Record<string, unknown>;
  const storedRatings = (data.ratings ?? {}) as Record<string, unknown>;

  const ratings = emptyRatings();
  for (const { key } of LIKERT) {
    const value = storedRatings[key];
    if (isScore(value, 1, 5)) ratings[key] = value;
  }

  const tanggal = asText(data.tanggal, 10);

  return {
    nama: asText(data.nama, NAMA_MAX),
    tanggal: /^\d{4}-\d{2}-\d{2}$/.test(tanggal) ? tanggal : "",
    layanan: (LAYANAN_VALUES as readonly string[]).includes(data.layanan as string)
      ? (data.layanan as string)
      : "",
    ratings,
    nps: isScore(data.nps, 0, 10) ? data.nps : null,
    saran: asText(data.saran, SARAN_MAX),
  };
}

export function loadDraft(): SurveyDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? parseDraft(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked (private mode, site data off); the form works without a draft.
  }
}

/** A draft holding only the auto-filled date is not worth restoring, so it is removed instead. */
export function saveDraft(draft: SurveyDraft) {
  const hasContent =
    draft.nama !== "" ||
    draft.layanan !== "" ||
    draft.saran !== "" ||
    draft.nps !== null ||
    LIKERT.some(({ key }) => draft.ratings[key] !== null);

  if (!hasContent) {
    clearDraft();
    return;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Quota or blocked storage: losing the draft is acceptable.
  }
}
