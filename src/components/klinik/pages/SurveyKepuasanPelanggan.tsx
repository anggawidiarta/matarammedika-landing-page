import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import KlinikPageShell from "@/components/klinik/layout/KlinikPageShell";
import KlinikPageTitle from "@/components/klinik/sections/KlinikPageTitle";
import {
  ConsentSubmit,
  KunjunganFields,
  LIKERT,
  NpsScale,
  PenilaianSection,
  REQUIRED_COUNT,
  SaranField,
  SurveyErrorAlert,
  SurveyProgress,
  SurveySuccess,
  emptyRatings,
  type FormStatus,
  type LikertKey,
  type Ratings,
} from "@/components/klinik/survey";
import { surveyZodFocus } from "@/components/klinik/survey/validationMessages";
import { parseSurveyPayload } from "@/lib/survey/schema";

export default function SurveyKepuasanPelanggan() {
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

  const answered = useMemo(() => {
    const likertDone = LIKERT.filter((item) => ratings[item.key] != null).length;
    return likertDone + (nps != null ? 1 : 0);
  }, [ratings, nps]);

  const progress = answered / REQUIRED_COUNT;
  const isLoading = status === "loading";
  const submitDisabled = isLoading || !consent;

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = parseSurveyPayload({
      nama: nama.trim() || null,
      tanggal: tanggal || null,
      layanan: layanan || null,
      ratings: {
        pendaftaran: ratings.pendaftaran,
        keramahan: ratings.keramahan,
        tunggu: ratings.tunggu,
        dokter: ratings.dokter,
        kebersihan: ratings.kebersihan,
        keseluruhan: ratings.keseluruhan,
      },
      nps,
      saran: saran.trim() || null,
      consent,
    });

    if (!parsed.ok) {
      const mapped = surveyZodFocus(formId, parsed.error);
      const isLayanan = parsed.error.issues[0]?.path[0] === "layanan";
      failValidation(mapped.message, mapped.focusId, {
        scroll: mapped.scroll ?? true,
        layananFieldError: isLayanan ? mapped.message : "",
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

  return (
    <KlinikPageShell activeLabel="Kepuasan" overflow="clip">
      <main className="mx-auto flex max-w-[760px] flex-col gap-8 px-6 pt-8 pb-24">
        <KlinikPageTitle
          title="Survey Kepuasan Pelanggan"
          caption="Isi singkat ini membantu kami merawat pelayanan klinik. Nama boleh dikosongkan. Perkiraan waktu: sekitar tiga menit."
        />

        {status === "success" ? (
          <SurveySuccess onReset={resetForm} />
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <SurveyProgress answered={answered} progress={progress} />

            {status === "error" ? (
              <SurveyErrorAlert message={errorMessage} alertRef={alertRef} />
            ) : null}

            <KunjunganFields
              formId={formId}
              nama={nama}
              tanggal={tanggal}
              layanan={layanan}
              layananError={layananError}
              onNamaChange={(value) => {
                setNama(value);
                clearError();
              }}
              onTanggalChange={(value) => {
                setTanggal(value);
                clearError();
              }}
              onLayananChange={(value) => {
                setLayanan(value);
                clearError();
              }}
            />

            <PenilaianSection formId={formId} ratings={ratings} onRate={setRating} />

            <NpsScale
              formId={formId}
              value={nps}
              onChange={(score) => {
                setNps(score);
                clearError();
              }}
            />

            <SaranField formId={formId} value={saran} onChange={setSaran} />

            <ConsentSubmit
              formId={formId}
              consent={consent}
              status={status}
              isLoading={isLoading}
              submitDisabled={submitDisabled}
              onConsentChange={(checked) => {
                setConsent(checked);
                clearError();
              }}
            />
          </form>
        )}
      </main>
    </KlinikPageShell>
  );
}
