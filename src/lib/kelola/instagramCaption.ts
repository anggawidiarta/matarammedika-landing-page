import { WA_KLINIK } from "@/data/site";
import { formatPromoPeriod, formatRupiah, todayInClinicZone } from "@/lib/cms/promoDisplay";
import { INSTAGRAM_CAPTION_MAX, INSTAGRAM_HASHTAG_MAX } from "@/lib/kelola/constants";

const DEFAULT_HASHTAGS = "#MataramMedika #PromoKlinik";

type CaptionSource = {
  title: string;
  body: string;
  normalPrice: number;
  promoPrice: number;
  startDate: string;
  endDate: string;
};

export function buildInstagramCaption(promo: CaptionSource): string {
  const price =
    promo.promoPrice < promo.normalPrice
      ? `💰 ${formatRupiah(promo.promoPrice)} (normal ${formatRupiah(promo.normalPrice)})`
      : `💰 ${formatRupiah(promo.promoPrice)}`;
  return [
    promo.title.trim(),
    promo.body.trim(),
    `${price}\n📅 ${formatPromoPeriod(promo.startDate, promo.endDate)}`,
    `Info & reservasi: ${WA_KLINIK.replace(/^https?:\/\//, "")}\n${DEFAULT_HASHTAGS}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function countHashtags(caption: string): number {
  return caption.match(/#[^\s#]+/g)?.length ?? 0;
}

export function validateInstagramCaption(caption: string): string | null {
  const trimmed = caption.trim();
  if (!trimmed || trimmed.length > INSTAGRAM_CAPTION_MAX) {
    return `Keterangan Instagram wajib diisi, maksimal ${INSTAGRAM_CAPTION_MAX} karakter.`;
  }
  if (countHashtags(trimmed) > INSTAGRAM_HASHTAG_MAX) {
    return `Instagram membatasi maksimal ${INSTAGRAM_HASHTAG_MAX} tagar.`;
  }
  return null;
}

/** Why a promo cannot be posted yet, or null when it can. Mirrors the server-side checks. */
export function instagramBlockReason(
  isPublished: boolean,
  endDate: string,
  today: string = todayInClinicZone(),
): string | null {
  if (!isPublished) return "Tampilkan promo di situs terlebih dahulu.";
  if (endDate && endDate < today) return "Promo sudah berakhir.";
  return null;
}
