import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";

export default function KlinikPageShell({ children }: { children: ReactNode }) {
  // Prefer clip so sticky header is not trapped by an overflow scroll container.
  return (
    <div className="overflow-x-clip">
      {children}
      <SiteFooter />
    </div>
  );
}
