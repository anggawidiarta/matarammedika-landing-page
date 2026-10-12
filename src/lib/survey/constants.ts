export const LAYANAN_VALUES = ["Klinik", "Apotek", "Klinik & Apotek"] as const;
export const SARAN_MAX = 500;
export const NAMA_MAX = 120;

export type LayananValue = (typeof LAYANAN_VALUES)[number];
export type SurveyApiError = "validation" | "rate_limited" | "server";

export type SurveyPayload = {
  nama: string | null;
  tanggal: string | null;
  layanan: LayananValue;
  ratings: {
    pendaftaran: number;
    keramahan: number;
    tunggu: number;
    dokter: number;
    kebersihan: number;
    keseluruhan: number;
  };
  nps: number;
  saran: string | null;
  consent: true;
};
