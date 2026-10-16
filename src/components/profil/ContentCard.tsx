import type { ReactNode } from "react";

export default function ContentCard({ children }: { children: ReactNode }) {
  return (
    <article className="font-body text-muted shadow-card rounded-3xl bg-white px-8 py-5 text-sm leading-6 text-pretty sm:text-base">
      {children}
    </article>
  );
}
