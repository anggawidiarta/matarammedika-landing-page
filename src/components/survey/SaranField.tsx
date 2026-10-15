import { SARAN_MAX } from "@/lib/survey/constants";
import SurveyCard from "./SurveyCard";
import { SurveyField, SurveyTextarea } from "./SurveyField";

export default function SaranField({
  formId,
  value,
  onChange,
}: {
  formId: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <SurveyCard className="gap-3">
      <SurveyField label="Saran atau catatan" htmlFor={`${formId}-saran`}>
        <SurveyTextarea
          id={`${formId}-saran`}
          name="saran"
          maxLength={SARAN_MAX}
          placeholder="Apa yang sudah baik, dan apa yang perlu kami perbaiki?"
          value={value}
          onChange={(event) => onChange(event.target.value.slice(0, SARAN_MAX))}
        />
      </SurveyField>
      <p className="text-xs text-right font-body text-muted">
        {value.length}/{SARAN_MAX}
      </p>
    </SurveyCard>
  );
}
