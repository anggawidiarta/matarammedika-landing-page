import { Timer } from "lucide-react";
import WhatsAppIcon from "@/components/shared/ui/WhatsAppIcon";
import { WA_KLINIK } from "@/data/site";
import {
  buildPromoClaimLink,
  formatRupiah,
  promoDiscountPercent,
  promoEndsAt,
  type PromoCardData,
} from "@/lib/cms/promoDisplay";
import PromoCountdown from "@/components/shared/ui/PromoCountdown";
import promoClinicImg from "@/assets/photos/promo-clinic.webp";

export default function PromoCard({ promo }: { promo: PromoCardData }) {
  const isEnded = promo.status === "ended";
  const isEnding = promo.status === "ending";
  const discount = promoDiscountPercent(promo.normalPrice, promo.promoPrice);

  return (
    <article
      className={`group shadow-float motion-safe:hover:shadow-cta relative flex flex-col overflow-hidden rounded-[16px] bg-white transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 ${isEnding ? "ring-promo/30 ring-2" : ""}`}
    >
      <div className="bg-surface-tint relative aspect-[16/9] overflow-hidden">
        <img
          src={promo.imageUrl ?? promoClinicImg.src}
          loading="lazy"
          decoding="async"
          alt=""
          width={383}
          height={400}
          className={`size-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105 ${isEnded ? "grayscale" : ""}`}
        />
        <div
          className="from-heading/70 absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t to-transparent"
          aria-hidden
        />
        <span
          className={`shadow-cta absolute top-3 left-3 inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[13px] text-white ${promo.badgeClass}`}
        >
          <Timer size={16} aria-hidden strokeWidth={2} />
          {promo.badge}
        </span>
        {discount > 0 && !isEnded ? (
          <span className="bg-promo font-accent shadow-cta absolute top-3 right-3 flex size-12 flex-col items-center justify-center rounded-full text-white">
            <span className="text-[10px] leading-none font-medium">Hemat</span>
            <span className="text-sm leading-tight font-semibold">{discount}%</span>
          </span>
        ) : null}
        <h3 className="font-body absolute inset-x-3 bottom-2.5 line-clamp-2 text-base leading-snug font-semibold text-balance text-white sm:text-lg">
          {promo.title}
        </h3>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-accent text-blue text-xl font-semibold">
            {formatRupiah(promo.promoPrice)}
          </p>
          {discount > 0 ? (
            <p className="font-body text-muted text-sm line-through">
              {formatRupiah(promo.normalPrice)}
            </p>
          ) : null}
        </div>

        <p className="font-body text-muted line-clamp-2 text-sm leading-5 text-pretty">
          {promo.body}
        </p>

        <div className="mt-auto flex flex-col gap-2.5 pt-1">
          {isEnded ? null : (
            <PromoCountdown endsAt={promoEndsAt(promo.endDate)} urgent={isEnding} />
          )}
          {isEnded ? (
            <span className="bg-surface-tint font-accent text-muted inline-flex min-h-11 items-center justify-center rounded-full px-6 py-2.5 text-base font-semibold">
              Promo telah berakhir
            </span>
          ) : (
            <a
              href={buildPromoClaimLink(WA_KLINIK, promo)}
              className={`${promo.claimClass} font-accent shadow-cta focus-visible:outline-blue inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-[transform,filter] duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97] sm:text-base`}
            >
              <WhatsAppIcon size={20} />
              Klaim Promo Sekarang
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
