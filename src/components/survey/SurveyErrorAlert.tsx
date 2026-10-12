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
      className="px-4 py-3 text-sm bg-white rounded-2xl border border-promo/40 font-body text-heading shadow-card"
    >
      {message}
    </div>
  );
}
