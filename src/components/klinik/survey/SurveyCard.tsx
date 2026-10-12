import type { ReactNode } from "react";

export default function SurveyCard({
  children,
  className = "gap-5",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex flex-col px-6 py-6 min-w-0 bg-white rounded-3xl shadow-card sm:px-8 ${className}`}
    >
      {children}
    </section>
  );
}
