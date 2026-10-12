import { useId, useRef, useState, type SubmitEvent } from "react";
import {
  LIKERT,
  REQUIRED_COUNT,
  emptyRatings,
  type FormStatus,
  type LikertKey,
  type Ratings,
} from "./constants";
import { validateSurveyClient } from "./validateClient";
import { surveyFieldFocus } from "./validationMessages";

export function useSurveyForm() {
  const formId = useId();
  const alertRef = useRef<HTMLDivElement>(null);
  const [nama, setNama] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [layanan, setLayanan] = useState("");
  const [ratings, setRatings] = useState<Ratings>(emptyRatings);
  const [nps, setNps] = useState<number | null>(null);
  const [saran, setSaran] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [layananError, setLayananError] = useState("");

  const answered =
    LIKERT.filter((item) => ratings[item.key] != null).length + (nps != null ? 1 : 0);
  const progress = answered / REQUIRED_COUNT;

  function clearError() {
    if (status === "error") setStatus("idle");
    if (layananError) setLayananError("");
  }

  function setRating(key: LikertKey, value: number) {
    setRatings((current) => ({ ...current, [key]: value }));
    clearError();
  }

  function resetForm() {
    setNama("");
    setTanggal("");
    setLayanan("");
    setRatings(emptyRatings());
    setNps(null);
    setSaran("");
    setConsent(false);
    setStatus("idle");
    setErrorMessage("");
    setLayananError("");
  }

  function failValidation(
    message: string,
    focusId: string,
    {
      scroll = true,
      layananFieldError = "",
    }: { scroll?: boolean; layananFieldError?: string } = {},
  ) {
    setStatus("error");
    setErrorMessage(message);
    setLayananError(layananFieldError);
    requestAnimationFrame(() => {
      const focusEl = document.getElementById(focusId);
      focusEl?.focus();
      if (scroll) {
        const scrollTarget = layananFieldError && focusEl ? focusEl : alertRef.current;
        scrollTarget?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = validateSurveyClient({
      nama,
      tanggal,
      layanan,
      ratings,
      nps,
      saran,
      consent,
    });

    if (!parsed.ok) {
      const mapped = surveyFieldFocus(formId, parsed.field, parsed.ratingKey);
      failValidation(mapped.message, mapped.focusId, {
        scroll: mapped.scroll ?? true,
        layananFieldError: parsed.field === "layanan" ? mapped.message : "",
      });
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setLayananError("");

    try {
      const response = await fetch("/api/survey-kepuasan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      let body: { ok?: boolean; error?: string } = {};
      try {
        body = (await response.json()) as { ok?: boolean; error?: string };
      } catch {
        body = {};
      }

      if (response.ok && body.ok) {
        setStatus("success");
        return;
      }

      if (response.status === 429 || body.error === "rate_limited") {
        failValidation(
          "Anda sudah mengirim terlalu sering. Coba lagi dalam sekitar satu jam.",
          `${formId}-consent`,
        );
        return;
      }

      if (response.status === 400 || body.error === "validation") {
        failValidation(
          "Data survey tidak valid. Periksa kembali isian Anda lalu kirim ulang.",
          `${formId}-consent`,
        );
        return;
      }

      failValidation(
        "Pengiriman gagal karena gangguan server. Silakan coba lagi sebentar.",
        `${formId}-consent`,
      );
    } catch {
      failValidation(
        "Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi.",
        `${formId}-consent`,
      );
    }
  }

  return {
    formId,
    alertRef,
    status,
    errorMessage,
    layananError,
    answered,
    progress,
    nama,
    tanggal,
    layanan,
    ratings,
    nps,
    saran,
    consent,
    setNama: (value: string) => {
      setNama(value);
      clearError();
    },
    setTanggal: (value: string) => {
      setTanggal(value);
      clearError();
    },
    setLayanan: (value: string) => {
      setLayanan(value);
      clearError();
    },
    setRating,
    setNps: (score: number) => {
      setNps(score);
      clearError();
    },
    setSaran,
    setConsent: (checked: boolean) => {
      setConsent(checked);
      clearError();
    },
    resetForm,
    handleSubmit,
  };
}

export type SurveyFormState = ReturnType<typeof useSurveyForm>;
