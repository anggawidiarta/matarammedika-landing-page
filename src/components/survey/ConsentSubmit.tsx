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
        className="flex gap-3 items-start min-w-0 cursor-pointer"
      >
        <input
          id={`${formId}-consent`}
          className="mt-1 size-4 shrink-0 accent-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          type="checkbox"
          checked={consent}
          onChange={(event) => onConsentChange(event.target.checked)}
        />
        <span className="text-sm leading-6 font-body text-muted">
          Saya setuju masukan ini dipakai internal Klinik Mataram Medika untuk meninjau dan
          memperbaiki pelayanan.
        </span>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        data-state={isLoading ? "loading" : status === "error" ? "error" : "default"}
        aria-busy={isLoading}
        className={`inline-flex justify-center items-center px-7 py-3 w-full text-lg font-semibold text-white rounded-full transition-opacity duration-200 ease-out ${gradientBg} survey-submit min-h-12 font-body shadow-cta hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 motion-reduce:transition-none motion-reduce:active:translate-y-0`}
      >
        {isLoading ? "Mengirim…" : "Kirim survey"}
      </button>
    </SurveyCard>
  );
}
