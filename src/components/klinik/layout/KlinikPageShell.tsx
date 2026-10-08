import type { ReactNode } from "react";
import KlinikHeader from "./KlinikHeader";
import type { NavKlinikLabel } from "@/components/klinik/data/navKlinik";
import SiteFooter from "./SiteFooter";

export default function KlinikPageShell({
  activeLabel,
  navVariant = "page",
  headerTone = "surface",
  overflow = "hidden",
  children,
}: {
  activeLabel: NavKlinikLabel;
  navVariant?: "home" | "page";
  headerTone?: "tint" | "surface";
  overflow?: "hidden" | "clip";
  children: ReactNode;
}) {
  const overflowClass =
    overflow === "clip" ? "overflow-x-clip" : "overflow-x-hidden";

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
