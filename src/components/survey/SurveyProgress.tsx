import { REQUIRED_COUNT } from "./formUi";

export default function SurveyProgress({
  answered,
  progress,
}: {
  answered: number;
  progress: number;
}) {
  return (
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
  );
}
