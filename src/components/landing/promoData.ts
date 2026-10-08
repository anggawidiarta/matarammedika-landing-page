import { gradientBg } from "./ui";

export const PROMO_DESCRIPTION =
  'Klinik Mataram Medika berkomitmen untuk memberikan kontribusi melalui layanan komprehensif. Dengan konsep "one stop service", kami memudahkan akses ke berbagai layanan kesehatan.';

export const PROMO_PERIOD = "10 Nov 2025 - 10 Des 2025";

export type PromoItem = {
  id: string;
  title: string;
  price: string;
  compare: string;
  badge: string;
  badgeClass: string;
  claimClass: string;
};

export const promoKlinikItems: PromoItem[] = [
  {
    id: "1",
    title: "Vaksin DPT Spesialiso",
    price: "Rp.150.000",
    compare: "Rp.350.000",
    badge: "Promo Bulan ini",
    badgeClass: "bg-brand-strong",
    claimClass: gradientBg,
  },
  {
    id: "2",
    title: "Vaksin DPT Spesialiso",
    price: "Rp.150.000",
    compare: "Rp.350.000",
    badge: "Sisa 2 hari",
    badgeClass: "bg-promo",
    claimClass: gradientBg,
  },
  {
    id: "3",
    title: "Vaksin DPT Spesialiso",
    price: "Rp.150.000",
    compare: "Rp.350.000",
    badge: "Berakhir",
    badgeClass: "bg-badge-neutral",
    claimClass: "bg-badge-neutral-dark",
  },
  {
    id: "4",
    title: "Vaksin DPT Spesialiso",
    price: "Rp.150.000",
    compare: "Rp.350.000",
    badge: "Promo Bulan ini",
    badgeClass: "bg-brand-strong",
    claimClass: gradientBg,
  },
  {
    id: "5",
    title: "Vaksin DPT polio",
    price: "Rp.150.000",
    compare: "Rp.350.000",
    badge: "Sisa 2 hari",
    badgeClass: "bg-promo",
    claimClass: gradientBg,
  },
  {
    id: "6",
    title: "Scalling gigi Dewasa",
    price: "Diskon 20%",
    compare: "",
    badge: "Berakhir",
    badgeClass: "bg-badge-neutral",
    claimClass: "bg-badge-neutral-dark",
  },
];

/** Tampilan ringkas di beranda (3 kartu). */
export const promoKlinikPreview = promoKlinikItems.filter((item) =>
  ["1", "5", "6"].includes(item.id),
);
