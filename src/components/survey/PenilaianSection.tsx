import { LIKERT, type LikertKey } from "@/lib/survey/constants";
import type { Ratings } from "./formUi";
import LikertRatingRow from "./LikertRatingRow";
import SurveyCard from "./SurveyCard";

export default function PenilaianSection({
  formId,
  ratings,
  onRate,
}: {
  formId: string;
  ratings: Ratings;
  onRate: (key: LikertKey, score: number) => void;
}) {
  return (
    <SurveyCard>
      <div className="flex flex-col gap-2 pb-4 min-w-0 border-b border-muted/15">
        <h2 className="text-xl font-semibold font-body text-heading">
          Penilaian pelayanan
        </h2>
        <p className="text-sm leading-relaxed font-body text-muted">
          Pilih angka <span className="font-medium text-heading">1</span> (sangat
          tidak puas) hingga{" "}
          <span className="font-medium text-heading">5</span> (sangat puas)
          untuk setiap aspek di bawah.
        </p>
      </div>
      <div className="flex flex-col min-w-0">
        {LIKERT.map((item, index) => (
          <LikertRatingRow
            key={item.key}
            index={index + 1}
            name={`${formId}-${item.key}`}
            label={item.label}
            value={ratings[item.key]}
            onChange={(score) => onRate(item.key, score)}
          />
        ))}
      </div>
    </SurveyCard>
  );
}
