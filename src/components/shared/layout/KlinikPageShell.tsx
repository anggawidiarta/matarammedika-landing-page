import type { ReactNode } from "react";
import KlinikHeader from "./KlinikHeader";
import type { NavKlinikLabel } from "@/components/shared/data/navKlinik";
import SiteFooter from "./SiteFooter";

export default function KlinikPageShell({
  activeLabel,
  navVariant = "page",
  headerTone = "surface",
  overflow = "clip",
  children,
}: {
  activeLabel: NavKlinikLabel;
  navVariant?: "home" | "page";
  headerTone?: "tint" | "surface";
  overflow?: "hidden" | "clip";
  children: ReactNode;
}) {
  // Prefer clip so sticky header is not trapped by an overflow scroll container.
  const overflowClass =
    overflow === "hidden" ? "overflow-x-hidden" : "overflow-x-clip";

  return (
    <div
      className={`min-h-screen ${overflowClass} bg-surface font-body text-heading`}
    >
      <KlinikHeader
        activeLabel={activeLabel}
        navVariant={navVariant}
        headerTone={headerTone}
      />
      {children}
      <SiteFooter />
    </div>
  );
}
