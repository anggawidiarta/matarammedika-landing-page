import { REQUIRED_COUNT } from "./formUi";

function ProgressTrack({ progress, className }: { progress: number; className: string }) {
  return (
    <div className={`overflow-hidden rounded-full ${className}`}>
      <div
        className="h-full origin-left bg-blue motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

export default function SurveyProgress({
  answered,
  progress,
  variant,
}: {
  answered: number;
  progress: number;
  variant: "panel" | "bar";
}) {
  if (variant === "bar") {
    return (
      <div
        className="bg-surface sticky top-[var(--header-h)] z-40 -mx-6 flex flex-col gap-1.5 px-6 py-2 lg:hidden"
        aria-label="Progres penilaian"
      >
        <p className="font-body text-muted text-xs">
          {answered} dari {REQUIRED_COUNT} isian wajib terisi
        </p>
        <ProgressTrack progress={progress} className="bg-surface-highlight h-1" />
      </div>
    );
  }

  return (
    <div className="mt-2 hidden flex-col gap-3 lg:flex" aria-label="Progres penilaian">
      <p className="font-body text-muted text-sm">
        <span className="font-accent text-heading text-4xl leading-none font-bold tabular-nums">
          {answered}
        </span>{" "}
        dari {REQUIRED_COUNT} isian wajib terisi
      </p>
      <ProgressTrack progress={progress} className="h-1.5 bg-white" />
    </div>
  );
}
