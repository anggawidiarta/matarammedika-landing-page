import type { ReactNode } from "react";

export default function ContentCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`font-body text-heading/80 shadow-card rounded-3xl bg-white px-6 py-6 text-base leading-7 text-pretty sm:px-8 sm:py-7 ${className}`}
    >
      {children}
    </article>
  );
}
