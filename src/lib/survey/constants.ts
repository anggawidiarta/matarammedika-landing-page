export const LAYANAN_VALUES = ["Klinik", "Apotek", "Klinik & Apotek"] as const;
export const SARAN_MAX = 500;
export const NAMA_MAX = 120;
export const SURVEY_BODY_MAX_BYTES = 8 * 1024;

/** Single source of truth for Likert rating keys + UI labels (Zod + client form). */
export const LIKERT = [
  { key: "pendaftaran", label: "Kemudahan pendaftaran & informasi" },
  { key: "keramahan", label: "Keramahan petugas" },
  { key: "tunggu", label: "Waktu tunggu" },
  { key: "dokter", label: "Kualitas pemeriksaan & penjelasan dokter" },
  { key: "kebersihan", label: "Kebersihan dan kenyamanan" },
  { key: "keseluruhan", label: "Kepuasan keseluruhan" },
] as const;

export type LikertKey = (typeof LIKERT)[number]["key"];
export type LayananValue = (typeof LAYANAN_VALUES)[number];
export type SurveyApiError = "validation" | "rate_limited" | "server";

