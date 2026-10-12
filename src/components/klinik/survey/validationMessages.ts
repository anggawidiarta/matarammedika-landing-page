import type { ZodError } from "zod";
import { LIKERT } from "./constants";

export function surveyZodFocus(
  formId: string,
  error: ZodError,
): { message: string; focusId: string; scroll?: boolean } {
  const issue = error.issues[0];
  if (!issue) {
    return {
      message: "Data survey tidak valid. Periksa kembali isian Anda.",
      focusId: `${formId}-consent`,
    };
  }

  const root = issue.path[0];

  if (root === "layanan") {
    return {
      message: "Pilih layanan (Klinik, Apotek, atau Klinik & Apotek).",
      focusId: `${formId}-layanan`,
    };
  }

  if (root === "ratings") {
    const key = String(issue.path[1] ?? "");
    const item = LIKERT.find((entry) => entry.key === key);
    return {
      message: item
        ? `Masih ada penilaian yang kosong. Lengkapi “${item.label}” sebelum mengirim.`
        : "Masih ada penilaian yang kosong. Lengkapi semua skala 1–5.",
      focusId: `${formId}-${key || "pendaftaran"}-1`,
    };
  }

  if (root === "nps") {
    return {
      message:
        "Pilih skor 0–10 untuk kemungkinan merekomendasikan klinik ini.",
      focusId: `${formId}-nps-0`,
    };
  }

  if (root === "consent") {
    return {
      message: "Centang persetujuan penggunaan masukan sebelum mengirim.",
      focusId: `${formId}-consent`,
      scroll: false,
    };
  }

  if (root === "nama") {
    return {
      message: "Nama terlalu panjang. Maksimal 120 karakter.",
      focusId: `${formId}-consent`,
    };
  }

  if (root === "tanggal") {
    return {
      message: "Tanggal kunjungan tidak valid.",
      focusId: `${formId}-consent`,
    };
  }

  if (root === "saran") {
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
