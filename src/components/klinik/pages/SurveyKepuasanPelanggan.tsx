/* Hallmark · component: survey-form · genre: editorial · theme: project-tokens (Mataram Medika)
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
import {
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import KlinikPageShell from "@/components/klinik/layout/KlinikPageShell";
import KlinikPageTitle from "@/components/klinik/sections/KlinikPageTitle";
import { gradientBg } from "@/components/klinik/ui";

const SARAN_MAX = 500;
const REQUIRED_COUNT = 7;
const POLI_OPTIONS = [
  "Umum",
  "Gigi",
  "Spesialis",
  "Rawat Darurat",
  "Lainnya",
] as const;

const LIKERT = [
  { key: "pendaftaran", label: "Kemudahan pendaftaran & informasi" },
  { key: "keramahan", label: "Keramahan petugas" },
  { key: "tunggu", label: "Waktu tunggu" },
  { key: "dokter", label: "Kualitas pemeriksaan & penjelasan dokter" },
  { key: "kebersihan", label: "Kebersihan dan kenyamanan" },
  { key: "keseluruhan", label: "Kepuasan keseluruhan" },
] as const;

type LikertKey = (typeof LIKERT)[number]["key"];
type Ratings = Record<LikertKey, number | null>;
type FormStatus = "idle" | "loading" | "error" | "success";

const emptyRatings = (): Ratings => ({
  pendaftaran: null,
  keramahan: null,
  tunggu: null,
  dokter: null,
  kebersihan: null,
  keseluruhan: null,
});

const fieldClass =
  "w-full min-w-0 rounded-2xl border border-muted/30 bg-surface-tint px-4 py-3 font-body text-sm text-heading outline-none transition-opacity duration-200 ease-out placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

const radioFace =
  "flex h-10 w-full min-w-0 items-center justify-center rounded-full border border-muted/40 bg-white text-sm font-semibold text-heading transition-[border-color,background-color,opacity] duration-200 ease-out peer-hover:border-blue peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue peer-checked:border-blue peer-checked:bg-surface-highlight peer-checked:text-blue";

const likertOptionFace =
  "flex aspect-square w-full max-w-[3.25rem] items-center justify-center justify-self-center rounded-2xl border border-muted/30 bg-white font-body text-base font-semibold text-heading shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out peer-hover:border-blue/70 peer-hover:bg-surface-highlight/60 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue peer-checked:border-blue peer-checked:bg-surface-highlight peer-checked:text-blue peer-checked:shadow-float peer-active:scale-[0.96] motion-reduce:transition-none motion-reduce:peer-active:scale-100";

function LikertRatingRow({
  index,
  name,
  label,
  value,
  onChange,
}: {
  index: number;
  name: string;
  label: string;
  value: number | null;
  onChange: (next: number) => void;
}) {
  const answered = value != null;

  return (
    <fieldset className="p-4 min-w-0 to-white rounded-2xl border border-muted/15 bg-linear-to-br from-surface-tint/80 sm:p-5">
      <legend className="mb-4 flex w-full min-w-0 items-start gap-3 px-0 font-body text-sm font-medium leading-snug text-heading [overflow-wrap:anywhere] sm:text-[15px]">
        <span
          aria-hidden="true"
          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full font-body text-xs font-semibold ${
            answered
              ? "bg-gradient-blue-green text-white shadow-sm"
              : "bg-surface-highlight text-muted"
          }`}
        >
          {index}
        </span>
        <span className="min-w-0 pt-0.5">{label}</span>
      </legend>

      <div
        className="mx-auto w-full max-w-[22rem] min-w-0 sm:max-w-[26rem]"
        role="group"
        aria-label={`Skala kepuasan untuk ${label}`}
      >
        <div className="relative px-2 py-3 rounded-2xl bg-surface-highlight/50 sm:px-3">
          <div
            aria-hidden="true"
            className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 pointer-events-none bg-muted/20"
          />
          <div className="relative grid min-w-0 grid-cols-5 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5].map((score) => {
              const id = `${name}-${score}`;
              return (
                <label
                  key={score}
                  htmlFor={id}
                  className="flex flex-col gap-1 items-center min-w-0 cursor-pointer"
                >
                  <input
                    id={id}
                    className="sr-only peer"
                    type="radio"
                    name={name}
                    value={score}
                    checked={value === score}
                    onChange={() => onChange(score)}
                    aria-label={`${score} dari 5`}
                  />
                  <span className={likertOptionFace}>{score}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-2.5 grid min-w-0 grid-cols-5 gap-1.5 px-0.5 font-body text-[11px] leading-tight text-muted sm:gap-2 sm:text-xs">
          <span className="col-span-2 text-left">Sangat tidak puas</span>
          <span className="col-span-1" aria-hidden="true" />
          <span className="col-span-2 text-right">Sangat puas</span>
        </div>

        <p
          className={`mt-2 min-h-5 text-center font-body text-xs transition-opacity duration-200 ${
            answered ? "opacity-100 text-blue" : "text-transparent opacity-0"
          }`}
          aria-live="polite"
        >
          {answered ? `Anda memilih ${value} dari 5` : ""}
        </p>
      </div>
    </fieldset>
  );
}

function SurveyCard({
  children,
  className = "gap-5",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex flex-col px-6 py-6 min-w-0 bg-white rounded-3xl shadow-card sm:px-8 ${className}`}
    >
      {children}
    </section>
  );
}

export default function SurveyKepuasanPelanggan() {
  const formId = useId();
  const alertRef = useRef<HTMLDivElement>(null);
  const [nama, setNama] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [poli, setPoli] = useState("");
  const [ratings, setRatings] = useState<Ratings>(emptyRatings);
  const [nps, setNps] = useState<number | null>(null);
  const [saran, setSaran] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const answered = useMemo(() => {
    const likertDone = LIKERT.filter(
      (item) => ratings[item.key] != null,
    ).length;
    return likertDone + (nps != null ? 1 : 0);
  }, [ratings, nps]);

  const progress = answered / REQUIRED_COUNT;
  const isLoading = status === "loading";
  const submitDisabled = isLoading || !consent;

  function setRating(key: LikertKey, value: number) {
    setRatings((current) => ({ ...current, [key]: value }));
    if (status === "error") setStatus("idle");
  }

  function resetForm() {
    setNama("");
    setTanggal("");
    setPoli("");
    setRatings(emptyRatings());
    setNps(null);
    setSaran("");
    setConsent(false);
    setStatus("idle");
    setErrorMessage("");
  }

  function failValidation(
    message: string,
    focusId: string,
    { scroll = true }: { scroll?: boolean } = {},
  ) {
    setStatus("error");
    setErrorMessage(message);
    requestAnimationFrame(() => {
      document.getElementById(focusId)?.focus();
      if (scroll) {
        alertRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missing = LIKERT.find((item) => ratings[item.key] == null);
    if (missing) {
      failValidation(
        `Masih ada penilaian yang kosong. Lengkapi “${missing.label}” sebelum mengirim.`,
        `${formId}-${missing.key}-1`,
      );
      return;
    }
    if (nps == null) {
      failValidation(
        "Pilih skor 0–10 untuk kemungkinan merekomendasikan klinik ini.",
        `${formId}-nps-0`,
      );
      return;
    }
    if (!consent) {
      failValidation(
        "Centang persetujuan penggunaan masukan sebelum mengirim.",
        `${formId}-consent`,
        { scroll: false },
      );
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    // TODO: persist to Supabase/API when backend is wired — mock only for now.
    window.setTimeout(() => {
      setStatus("success");
    }, 600);
  }

  return (
    <KlinikPageShell activeLabel="Kepuasan" overflow="clip">
      <main className="mx-auto flex max-w-[760px] flex-col gap-8 px-6 pt-8 pb-24">
        <KlinikPageTitle
          title="Survey Kepuasan Pelanggan"
          caption="Isi singkat ini membantu kami merawat pelayanan klinik. Nama boleh dikosongkan. Perkiraan waktu: sekitar tiga menit."
        />

        {status === "success" ? (
          <section
            className="flex flex-col gap-6 items-center px-8 py-12 text-center bg-white rounded-3xl shadow-card"
            aria-live="polite"
          >
            <span
              aria-hidden="true"
              className="flex justify-center items-center text-2xl font-semibold rounded-full size-14 bg-surface-highlight text-blue"
            >
              ✓
            </span>
            <div className="flex flex-col gap-2 min-w-0">
              <h2 className="text-2xl font-semibold font-body text-heading">
                Terima kasih atas masukan Anda
              </h2>
              <p className="text-base leading-6 font-body text-muted">
                Pengiriman ini masih simulasi — data belum disimpan ke server.
                Tim klinik akan memakai fitur ini setelah integrasi backend
                selesai.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <a
                href="/"
                className={`inline-flex justify-center items-center px-7 py-3 text-base font-semibold text-white rounded-full ${gradientBg} min-h-12 font-body shadow-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue`}
              >
                Kembali ke beranda
              </a>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex justify-center items-center px-7 py-3 text-base font-semibold rounded-full border min-h-12 border-muted font-body text-muted hover:border-blue hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue active:translate-y-px"
              >
                Isi lagi
              </button>
            </div>
          </section>
        ) : (
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="flex flex-col gap-2" aria-label="Progres penilaian">
              <p className="text-sm font-body text-muted">
                {answered} dari {REQUIRED_COUNT} penilaian terisi
              </p>
              <div className="overflow-hidden h-1 rounded-full bg-surface-highlight">
                <div
                  className="h-full origin-left bg-blue motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
            </div>

            {status === "error" ? (
              <div
                ref={alertRef}
                role="alert"
                className="px-4 py-3 text-sm bg-white rounded-2xl border border-promo/40 font-body text-heading shadow-card"
              >
                {errorMessage}
              </div>
            ) : null}

            <SurveyCard>
              <h2 className="text-xl font-semibold font-body text-heading">
                Kunjungan (opsional)
              </h2>
              <div className="grid gap-4 min-w-0 sm:grid-cols-2">
                <label className="flex flex-col gap-2 min-w-0">
                  <span className="text-sm font-medium font-body text-heading">
                    Nama
                  </span>
                  <input
                    className={fieldClass}
                    type="text"
                    name="nama"
                    autoComplete="name"
                    placeholder="Boleh dikosongkan"
                    value={nama}
                    onChange={(event) => setNama(event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 min-w-0">
                  <span className="text-sm font-medium font-body text-heading">
                    Tanggal kunjungan
                  </span>
                  <input
                    className={fieldClass}
                    type="date"
                    name="tanggal"
                    value={tanggal}
                    onChange={(event) => setTanggal(event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 min-w-0 sm:col-span-2">
                  <span className="text-sm font-medium font-body text-heading">
                    Poli / layanan
                  </span>
                  <select
                    className={fieldClass}
                    name="poli"
                    value={poli}
                    onChange={(event) => setPoli(event.target.value)}
                  >
                    <option value="">Pilih jika relevan</option>
                    {POLI_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </SurveyCard>

            <SurveyCard>
              <div className="flex flex-col gap-2 pb-4 min-w-0 border-b border-muted/15">
                <h2 className="text-xl font-semibold font-body text-heading">
                  Penilaian pelayanan
                </h2>
                <p className="text-sm leading-relaxed font-body text-muted">
                  Pilih angka{" "}
                  <span className="font-medium text-heading">1</span> (sangat
                  tidak puas) hingga{" "}
                  <span className="font-medium text-heading">5</span> (sangat
                  puas) untuk setiap aspek di bawah.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-w-0">
                {LIKERT.map((item, index) => (
                  <LikertRatingRow
                    key={item.key}
                    index={index + 1}
                    name={`${formId}-${item.key}`}
                    label={item.label}
                    value={ratings[item.key]}
                    onChange={(score) => setRating(item.key, score)}
                  />
                ))}
              </div>
            </SurveyCard>

            <SurveyCard className="gap-4">
              <fieldset className="flex flex-col gap-3 p-0 min-w-0 border-0">
                <legend className="mb-1 w-full min-w-0 px-0 font-body text-sm font-medium text-heading [overflow-wrap:anywhere]">
                  Seberapa mungkin Anda merekomendasikan Klinik Mataram Medika
                  kepada keluarga atau tetangga?
                </legend>
                <div className="grid grid-cols-4 gap-2 min-w-0 sm:grid-cols-6 lg:grid-cols-11">
                  {Array.from({ length: 11 }, (_, score) => {
                    const id = `${formId}-nps-${score}`;
                    return (
                      <label
                        key={score}
                        htmlFor={id}
                        className="min-w-0 cursor-pointer"
                      >
                        <input
                          id={id}
                          className="sr-only peer"
                          type="radio"
                          name={`${formId}-nps`}
                          value={score}
                          checked={nps === score}
                          onChange={() => {
                            setNps(score);
                            if (status === "error") setStatus("idle");
                          }}
                        />
                        <span className={`w-full ${radioFace}`}>{score}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="flex gap-3 justify-between min-w-0 text-xs font-body text-muted">
                  <span>Tidak mungkin</span>
                  <span className="text-right">Sangat mungkin</span>
                </div>
              </fieldset>
            </SurveyCard>

            <SurveyCard className="gap-3">
              <label
                className="flex flex-col gap-2 min-w-0"
                htmlFor={`${formId}-saran`}
              >
                <span className="text-sm font-medium font-body text-heading">
                  Saran atau catatan
                </span>
                <textarea
                  id={`${formId}-saran`}
                  className={`resize-y ${fieldClass} min-h-32`}
                  name="saran"
                  maxLength={SARAN_MAX}
                  placeholder="Apa yang sudah baik, dan apa yang perlu kami perbaiki?"
                  value={saran}
                  onChange={(event) =>
                    setSaran(event.target.value.slice(0, SARAN_MAX))
                  }
                />
              </label>
              <p className="text-xs text-right font-body text-muted">
                {saran.length}/{SARAN_MAX}
              </p>
            </SurveyCard>

            <SurveyCard>
              <label
                htmlFor={`${formId}-consent`}
                className="flex gap-3 items-start min-w-0 cursor-pointer"
              >
                <input
                  id={`${formId}-consent`}
                  className="mt-1 size-4 shrink-0 accent-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => {
                    setConsent(event.target.checked);
                    if (status === "error") setStatus("idle");
                  }}
                />
                <span className="text-sm leading-6 font-body text-muted">
                  Saya setuju masukan ini dipakai internal Klinik Mataram Medika
                  untuk meninjau dan memperbaiki pelayanan.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitDisabled}
                data-state={
                  isLoading
                    ? "loading"
                    : status === "error"
                      ? "error"
                      : "default"
                }
                aria-busy={isLoading}
                className={`inline-flex justify-center items-center px-7 py-3 w-full text-lg font-semibold text-white rounded-full transition-opacity duration-200 ease-out ${gradientBg} survey-submit min-h-12 font-body shadow-cta hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 motion-reduce:transition-none motion-reduce:active:translate-y-0`}
              >
                {isLoading ? "Mengirim…" : "Kirim survey"}
              </button>
              {!consent ? (
                <p className="text-xs font-body text-muted">
                  Tombol aktif setelah persetujuan dicentang.
                </p>
              ) : null}
            </SurveyCard>
          </form>
        )}
      </main>
    </KlinikPageShell>
  );
}
