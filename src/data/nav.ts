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
