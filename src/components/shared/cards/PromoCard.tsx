import { Calendar, MessageCircle, Tag, Timer } from "lucide-react";
import { WA_KLINIK } from "@/data/site";
import {
  formatPromoPeriod,
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
  const saving = promo.normalPrice - promo.promoPrice;

  return (
    <article
      className={`group shadow-float motion-safe:hover:shadow-cta relative flex flex-col overflow-hidden rounded-[20px] bg-white transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 ${isEnding ? "ring-promo/30 ring-2" : ""}`}
    >
      <div className="bg-surface-tint relative aspect-[4/3] overflow-hidden">
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
          className={`shadow-cta absolute top-4 left-4 inline-flex h-8 items-center gap-1 rounded-lg px-2 text-sm text-white ${promo.badgeClass}`}
        >
          <Timer size={18} aria-hidden strokeWidth={2} />
          {promo.badge}
        </span>
        {discount > 0 && !isEnded ? (
          <span className="bg-promo font-accent shadow-cta absolute top-4 right-4 flex size-14 flex-col items-center justify-center rounded-full text-white">
            <span className="text-[10px] leading-none font-medium">Hemat</span>
            <span className="text-base leading-tight font-semibold">{discount}%</span>
          </span>
        ) : null}
        <h3 className="font-body absolute inset-x-4 bottom-3 text-lg leading-snug font-semibold text-balance text-white sm:text-xl">
          {promo.title}
        </h3>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-accent text-blue text-2xl font-semibold">
            {formatRupiah(promo.promoPrice)}
          </p>
          {saving > 0 ? (
            <p className="font-body text-muted text-sm line-through">
              {formatRupiah(promo.normalPrice)}
            </p>
          ) : null}
        </div>
        {saving > 0 && !isEnded ? (
          <p className="bg-green/10 font-body text-green inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-0.5 text-[13px] font-medium">
            <Tag size={16} aria-hidden strokeWidth={2} />
            Anda hemat {formatRupiah(saving)}
          </p>
        ) : null}

        <p className="font-body text-muted text-sm leading-6 text-pretty">{promo.body}</p>

        <p className="font-body text-muted flex items-center gap-2 text-[13px] leading-5">
          <Calendar size={18} aria-hidden strokeWidth={2} className="shrink-0" />
          Periode: {formatPromoPeriod(promo.startDate, promo.endDate)}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-1">
          {isEnded ? null : (
            <PromoCountdown endsAt={promoEndsAt(promo.endDate)} urgent={isEnding} />
          )}
          {isEnded ? (
            <span className="bg-surface-tint font-accent text-muted inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-base font-semibold">
              Promo telah berakhir
            </span>
          ) : (
            <a
              href={WA_KLINIK}
              className={`${promo.claimClass} font-accent shadow-cta focus-visible:outline-blue inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white transition-[transform,filter] duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]`}
            >
              <MessageCircle size={20} className="fill-white" aria-hidden strokeWidth={2} />
              Klaim Promo Sekarang
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
