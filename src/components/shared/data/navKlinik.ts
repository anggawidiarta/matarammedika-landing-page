export const navKlinik = [
  { label: "Beranda", href: "/" },
  { label: "Dokter", href: "/dokter-klinik" },
  { label: "Layanan", href: "/layanan-klinik" },
  { label: "Fasilitas", href: "/fasilitas-klinik" },
  { label: "Promo", href: "/promo-klinik" },
  { label: "Survey Kepuasan", href: "/survey-kepuasan-pelanggan" },
  { label: "Profil", href: "/profil-klinik" },
] as const;

export type NavKlinikLabel = (typeof navKlinik)[number]["label"];

const homeAnchors: Partial<Record<NavKlinikLabel, string>> = {
  Beranda: "#beranda",
  Layanan: "#layanan",
  Fasilitas: "#fasilitas",
};

export function navKlinikHref(item: (typeof navKlinik)[number], variant: "home" | "page" = "page") {
  if (variant === "home" && item.label in homeAnchors) {
    return homeAnchors[item.label] as string;
  }
  return item.href;
}

const navLinkBase =
  "rounded-md transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export function navLinkClass(label: string, activeLabel: string) {
  return label === activeLabel
    ? `${navLinkBase} font-semibold text-blue`
    : `${navLinkBase} text-muted opacity-80 hover:text-heading hover:opacity-100`;
}

export function navLinkMobileClass(label: string, activeLabel: string) {
  return label === activeLabel
    ? `${navLinkBase} block rounded-2xl bg-surface-highlight px-4 py-3 font-semibold text-blue`
    : `${navLinkBase} block rounded-2xl px-4 py-3 text-muted opacity-80 hover:bg-surface-tint hover:text-heading hover:opacity-100`;
}
