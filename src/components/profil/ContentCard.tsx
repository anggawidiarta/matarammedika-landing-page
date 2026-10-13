import type { ReactNode } from "react";

export default function ContentCard({ children }: { children: ReactNode }) {
  return (
    <article className="px-8 py-5 text-sm leading-6 bg-white rounded-3xl font-body text-pretty text-muted shadow-card sm:text-base">
      {children}
    </article>
  );
}
