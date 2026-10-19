import ConsentSubmit from "./ConsentSubmit";
import KunjunganFields from "./KunjunganFields";
import NpsScale from "./NpsScale";
import PenilaianSection from "./PenilaianSection";
import SaranField from "./SaranField";
import SurveyErrorAlert from "./SurveyErrorAlert";
import SurveyProgress from "./SurveyProgress";
import type { SurveyFormState } from "./useSurveyForm";

export default function SurveyForm({ form }: { form: SurveyFormState }) {
  const {
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
    setNama,
    setTanggal,
    setLayanan,
    setRating,
    setNps,
    setSaran,
    setConsent,
    handleSubmit,
  } = form;

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <SurveyProgress variant="bar" answered={answered} progress={progress} />

      {status === "error" ? <SurveyErrorAlert message={errorMessage} alertRef={alertRef} /> : null}

      <KunjunganFields
        formId={formId}
        nama={nama}
        tanggal={tanggal}
        layanan={layanan}
        layananError={layananError}
        onNamaChange={setNama}
        onTanggalChange={setTanggal}
        onLayananChange={setLayanan}
      />

      <PenilaianSection formId={formId} ratings={ratings} onRate={setRating} />

      <NpsScale formId={formId} value={nps} onChange={setNps} />

      <SaranField formId={formId} value={saran} onChange={setSaran} />

      <ConsentSubmit
        formId={formId}
        consent={consent}
        status={status}
        onConsentChange={setConsent}
      />
    </form>
  );
}
