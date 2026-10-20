import { radioFace } from "./formUi";
import SurveyCard from "./SurveyCard";

export default function NpsScale({
  formId,
  value,
  onChange,
}: {
  formId: string;
  value: number | null;
  onChange: (score: number) => void;
}) {
  return (
    <SurveyCard className="gap-4">
      <fieldset className="flex flex-col gap-3 p-0 min-w-0 border-0">
        <legend className="mb-1 w-full min-w-0 px-0 font-body text-sm font-medium text-heading [overflow-wrap:anywhere]">
          Seberapa mungkin Anda merekomendasikan Klinik Mataram Medika kepada
          keluarga atau tetangga?
        </legend>
        <div className="grid grid-cols-6 gap-2 min-w-0 lg:grid-cols-11">
          {Array.from({ length: 11 }, (_, score) => {
            const id = `${formId}-nps-${score}`;
            return (
              <label key={score} htmlFor={id} className="min-w-0 cursor-pointer">
                <input
                  id={id}
                  className="sr-only peer"
                  type="radio"
                  name={`${formId}-nps`}
                  value={score}
                  checked={value === score}
                  onChange={() => onChange(score)}
                />
                <span className={`w-full ${radioFace}`}>{score}</span>
              </label>
            );
          })}
        </div>
        <div className="flex gap-3 justify-between min-w-0 text-sm font-body text-heading/70">
          <span>Tidak mungkin</span>
          <span className="text-right">Sangat mungkin</span>
        </div>
      </fieldset>
    </SurveyCard>
  );
}
