import type { PromoItem } from "@/lib/cms/promoDisplay";
import type { KelolaItem } from "@/lib/kelola/types";

export type PromoFields = {
  imagePath: string | null;
  normalPrice: number;
  promoPrice: number;
  startDate: string;
  endDate: string;
};

/** Rows come from jsonb, so fields are read defensively and fall back to empty values. */
export function readPromo(item: KelolaItem): PromoFields {
  const data = item.data;
  const number = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value) ? value : 0;
  const text = (value: unknown) => (typeof value === "string" ? value : "");
  return {
    imagePath: typeof data.image_path === "string" ? data.image_path : null,
    normalPrice: number(data.normal_price),
    promoPrice: number(data.promo_price),
    startDate: text(data.start_date),
    endDate: text(data.end_date),
  };
}

export function imageUrlFor(imageBaseUrl: string, imagePath: string | null): string | null {
  return imagePath ? `${imageBaseUrl}${imagePath}` : null;
}

export function toPromoItem(
  id: string,
  title: string,
  body: string,
  fields: PromoFields,
  imageUrl: string | null,
): PromoItem {
  return {
    id,
    title,
    body,
    imageUrl,
    normalPrice: fields.normalPrice,
    promoPrice: fields.promoPrice,
    startDate: fields.startDate,
    endDate: fields.endDate,
  };
}
