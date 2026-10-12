import {
  LAYANAN_VALUES,
  NAMA_MAX,
  SARAN_MAX,
  type LayananValue,
  type SurveyPayload,
} from "@/lib/survey/constants";
import { LIKERT, type Ratings } from "./constants";

export type SurveyFieldError =
  | "layanan"
  | "ratings"
  | "nps"
  | "consent"
  | "nama"
  | "tanggal"
  | "saran";

export type ClientValidationResult =
  | { ok: true; data: SurveyPayload }
  | { ok: false; field: SurveyFieldError; ratingKey?: string };

function isLayananValue(value: string): value is LayananValue {
  return (LAYANAN_VALUES as readonly string[]).includes(value);
}

function isValidTanggal(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export function validateSurveyClient({
  nama,
  tanggal,
  layanan,
  ratings,
  nps,
  saran,
  consent,
}: {
  nama: string;
  tanggal: string;
  layanan: string;
  ratings: Ratings;
  nps: number | null;
  saran: string;
  consent: boolean;
}): ClientValidationResult {
  const namaTrimmed = nama.trim();
  if (namaTrimmed.length > NAMA_MAX) {
    return { ok: false, field: "nama" };
  }

  if (tanggal && !isValidTanggal(tanggal)) {
    return { ok: false, field: "tanggal" };
  }

  if (!isLayananValue(layanan)) {
    return { ok: false, field: "layanan" };
  }

  const resolvedRatings = {} as SurveyPayload["ratings"];
  for (const item of LIKERT) {
    const value = ratings[item.key];
    if (value == null || value < 1 || value > 5 || !Number.isInteger(value)) {
      return { ok: false, field: "ratings", ratingKey: item.key };
    }
    resolvedRatings[item.key] = value;
  }

  if (nps == null || nps < 0 || nps > 10 || !Number.isInteger(nps)) {
    return { ok: false, field: "nps" };
  }

  const saranTrimmed = saran.trim();
  if (saranTrimmed.length > SARAN_MAX) {
    return { ok: false, field: "saran" };
  }

  if (!consent) {
    return { ok: false, field: "consent" };
  }

  return {
    ok: true,
    data: {
      nama: namaTrimmed || null,
      tanggal: tanggal || null,
      layanan,
      ratings: resolvedRatings,
      nps,
      saran: saranTrimmed || null,
      consent: true,
    },
  };
}
