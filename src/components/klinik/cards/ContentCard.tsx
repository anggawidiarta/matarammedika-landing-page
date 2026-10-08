import type { ReactNode } from "react";

export default function ContentCard({ children }: { children: ReactNode }) {
  return (
    <article className="rounded-3xl bg-white px-8 py-5 shadow-card font-body text-sm leading-5 text-muted">
      {children}
    </article>
  );
}
