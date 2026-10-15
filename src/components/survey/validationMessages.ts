import { LIKERT } from "@/lib/survey/constants";
import type { SurveyFieldError } from "./validateClient";

export function surveyFieldFocus(
  formId: string,
  field: SurveyFieldError,
  ratingKey?: string,
): { message: string; focusId: string; scroll?: boolean } {
  if (field === "layanan") {
    return {
      message: "Pilih layanan (Klinik, Apotek, atau Klinik & Apotek).",
      focusId: `${formId}-layanan`,
    };
  }

  if (field === "ratings") {
    const key = ratingKey ?? "";
    const item = LIKERT.find((entry) => entry.key === key);
    return {
      message: item
        ? `Masih ada penilaian yang kosong. Lengkapi “${item.label}” sebelum mengirim.`
        : "Masih ada penilaian yang kosong. Lengkapi semua skala 1–5.",
      focusId: `${formId}-${key || "pendaftaran"}-1`,
    };
  }

  if (field === "nps") {
    return {
      message: "Pilih skor 0–10 untuk kemungkinan merekomendasikan klinik ini.",
      focusId: `${formId}-nps-0`,
    };
  }

  if (field === "consent") {
    return {
      message: "Centang persetujuan penggunaan masukan sebelum mengirim.",
      focusId: `${formId}-consent`,
      scroll: false,
    };
  }

  if (field === "nama") {
    return {
      message: "Nama terlalu panjang. Maksimal 120 karakter.",
      focusId: `${formId}-nama`,
    };
  }

  if (field === "tanggal") {
    return {
      message: "Tanggal kunjungan tidak valid.",
      focusId: `${formId}-tanggal`,
    };
  }

  if (field === "saran") {
    return {
      message: "Saran terlalu panjang. Maksimal 500 karakter.",
      focusId: `${formId}-saran`,
    };
  }

  return {
    message: "Data survey tidak valid. Periksa kembali isian Anda.",
    focusId: `${formId}-consent`,
  };
}
