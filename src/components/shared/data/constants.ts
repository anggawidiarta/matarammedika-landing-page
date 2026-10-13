/** WhatsApp deep link — Klinik Mataram Medika */
export const WA_KLINIK = "https://wa.me/6287878847788";

/** Shared Tailwind class for blue→green CTA / badge fills */
export const gradientBg = "bg-gradient-blue-green";

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
