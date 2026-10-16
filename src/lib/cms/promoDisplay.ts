/** Pure promo model + display rules (no server imports, safe for components). */

export type PromoItem = {
  id: string;
  title: string;
  body: string;
  /** Absolute public URL, or null to use the default clinic photo. */
  imageUrl: string | null;
  normalPrice: number;
  promoPrice: number;
  /** ISO dates `YYYY-MM-DD`. */
  startDate: string;
  endDate: string;
};

export type PromoStatus = "ongoing" | "ending" | "ended";

export type PromoCardData = PromoItem & {
  status: PromoStatus;
  badge: string;
  badgeClass: string;
  claimClass: string;
};

const CLINIC_TIME_ZONE = "Asia/Makassar";
const ENDING_SOON_DAYS = 3;

/** Today as `YYYY-MM-DD` in the clinic's time zone (WITA). */
export function todayInClinicZone(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC_TIME_ZONE }).format(now);
}

function dayNumber(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

/** Null while the promo has not started yet (not shown on the landing page). */
function toPromoCard(item: PromoItem, today: string): PromoCardData | null {
  if (today < item.startDate) return null;

  if (today > item.endDate) {
    return {
      ...item,
      status: "ended",
      badge: "Berakhir",
      badgeClass: "bg-gray",
      claimClass: "bg-gray-dark",
    };
  }

  const daysLeft = dayNumber(item.endDate) - dayNumber(today);
  if (daysLeft <= ENDING_SOON_DAYS) {
    return {
      ...item,
      status: "ending",
      badge: daysLeft === 0 ? "Berakhir hari ini" : `Sisa ${daysLeft} hari`,
      badgeClass: "bg-promo",
      claimClass: "bg-gradient-blue-green",
    };
  }

  return {
    ...item,
    status: "ongoing",
    badge: "Promo Berlangsung",
    badgeClass: "bg-blue",
    claimClass: "bg-gradient-blue-green",
  };
}

/** Drops scheduled promos and lists ended ones last, keeping CMS order within each group. */
export function toPromoCards(items: PromoItem[], today: string = todayInClinicZone()): PromoCardData[] {
  const cards = items
    .map((item) => toPromoCard(item, today))
    .filter((card): card is PromoCardData => card !== null);
  return [
    ...cards.filter((card) => card.status !== "ended"),
    ...cards.filter((card) => card.status === "ended"),
  ];
}

/** Last instant of the promo's final day in the clinic's time zone (WITA, UTC+8, no DST). */
export function promoEndsAt(endDate: string): number {
  return new Date(`${endDate}T23:59:59.999+08:00`).getTime();
}

/** Whole-percent discount, or 0 when there is no real discount. */
export function promoDiscountPercent(normalPrice: number, promoPrice: number): number {
  if (normalPrice <= 0 || promoPrice >= normalPrice) return 0;
  return Math.round(((normalPrice - promoPrice) / normalPrice) * 100);
}

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export function formatPromoPeriod(startDate: string, endDate: string): string {
  const format = (iso: string) => {
    const [year, month, day] = iso.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };
  return `${format(startDate)} - ${format(endDate)}`;
}
