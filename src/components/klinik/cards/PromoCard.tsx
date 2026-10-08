import { Calendar, MessageCircle, Timer } from "lucide-react";
import { promoClinic } from "@/components/klinik/data/assets";
import { WA_KLINIK } from "@/components/klinik/data/constants";
import {
  PROMO_DESCRIPTION,
  PROMO_PERIOD,
  type PromoItem,
} from "@/components/klinik/data/promoData";

export default function PromoCard({ promo }: { promo: PromoItem }) {
  return (
    <article className="relative flex flex-col items-center gap-5 rounded-[20px] bg-white pb-6 shadow-float">
      <img
        src={promoClinic}
        alt=""
        width={383}
        height={400}
        className="h-100 w-full rounded-3xl object-cover"
      />
      <span
        className={`absolute left-4 top-4 inline-flex h-8 items-center gap-1 rounded-lg px-2 text-sm text-white ${promo.badgeClass}`}
      >
        <Timer size={20} aria-hidden strokeWidth={2} />
        {promo.badge}
      </span>
      <div className="flex w-full flex-col gap-2.5 px-6">
        <h3 className="font-body text-2xl font-medium text-heading">
          {promo.title}
        </h3>
        <p className="font-body text-2xl font-medium text-blue">
          {promo.price}
          {promo.compare ? (
            <span className="ml-2 text-sm font-normal text-muted line-through">
              {promo.compare}
            </span>
          ) : null}
        </p>
        <p className="flex items-center gap-1 font-body text-base leading-6 text-muted">
          <Calendar size={20} aria-hidden strokeWidth={2} />
          Periode : {PROMO_PERIOD}
        </p>
        <p className="font-body text-base leading-6 text-muted">
          {PROMO_DESCRIPTION}
        </p>
      </div>
      <a
        href={WA_KLINIK}
        className={`${promo.claimClass} inline-flex items-center gap-2 rounded-full px-7 py-4 font-accent text-lg font-semibold text-white`}
      >
        <MessageCircle size={24} className="fill-white" aria-hidden strokeWidth={2} />
        Klaim Promo
      </a>
    </article>
  );
}
