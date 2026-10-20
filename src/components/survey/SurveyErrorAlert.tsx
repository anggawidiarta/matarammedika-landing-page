import { CircleAlert } from "lucide-react";
import { type Ref } from "react";

export default function SurveyErrorAlert({
  message,
  alertRef,
}: {
  message: string;
  alertRef: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={alertRef}
      role="alert"
      className="flex items-start gap-3 px-4 py-3 text-sm bg-white rounded-2xl border border-promo/40 font-body text-heading shadow-card"
    >
      <CircleAlert size={20} className="mt-0.5 shrink-0 text-promo" aria-hidden />
      <span>{message}</span>
    </div>
  );
}
