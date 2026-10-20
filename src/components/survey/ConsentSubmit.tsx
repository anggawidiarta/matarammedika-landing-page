import { gradientBg } from "@/components/shared/ui/gradient";
import type { FormStatus } from "./formUi";
import SurveyCard from "./SurveyCard";

export default function ConsentSubmit({
  formId,
  consent,
  status,
  onConsentChange,
}: {
  formId: string;
  consent: boolean;
  status: FormStatus;
  onConsentChange: (checked: boolean) => void;
}) {
  const isLoading = status === "loading";

  return (
    <SurveyCard>
      <label
        htmlFor={`${formId}-consent`}
        className="flex min-w-0 cursor-pointer items-start gap-3"
      >
        <input
          id={`${formId}-consent`}
          className="accent-blue focus-visible:outline-blue mt-0.5 size-5 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2"
          type="checkbox"
          checked={consent}
          onChange={(event) => onConsentChange(event.target.checked)}
        />
        <span className="font-body text-heading/70 text-sm leading-6">
          Saya setuju masukan ini dipakai internal Klinik Mataram Medika untuk meninjau dan
          memperbaiki pelayanan.
        </span>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        data-state={isLoading ? "loading" : status === "error" ? "error" : "default"}
        aria-busy={isLoading}
        className={`inline-flex w-full items-center justify-center rounded-full px-7 py-3 text-lg font-semibold text-white transition-opacity duration-200 ease-out ${gradientBg} survey-submit font-body shadow-cta focus-visible:outline-blue min-h-12 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100`}
      >
        {isLoading ? "Mengirim…" : "Kirim survey"}
      </button>
    </SurveyCard>
  );
}
