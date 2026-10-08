export const navKlinik = [
  { label: "Beranda", href: "/" },
  { label: "Dokter", href: "/dokter-klinik" },
  { label: "Layanan", href: "/layanan-klinik" },
  { label: "Fasilitas", href: "/fasilitas-klinik" },
  { label: "Promo", href: "/promo-klinik" },
  { label: "Kepuasan", href: "/survey-kepuasan-pelanggan" },
  { label: "Profil", href: "/profil-klinik" },
] as const;

export type NavKlinikLabel = (typeof navKlinik)[number]["label"];

const homeAnchors: Partial<Record<NavKlinikLabel, string>> = {
  Beranda: "#beranda",
  Layanan: "#layanan",
  Fasilitas: "#fasilitas",
};

export function navKlinikHref(
  item: (typeof navKlinik)[number],
  variant: "home" | "page" = "page",
) {
  if (variant === "home" && item.label in homeAnchors) {
    return homeAnchors[item.label] as string;
  }
  return item.href;
}

export function navLinkClass(label: string, activeLabel: string) {
  return label === activeLabel
    ? "font-bold text-blue"
    : "text-muted opacity-80";
}
