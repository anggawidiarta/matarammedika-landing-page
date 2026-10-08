import {
  iconCalendar,
  iconTimer,
  iconWhatsappWhite,
  promoClinic,
} from "./assets";
import { PROMO_DESCRIPTION, PROMO_PERIOD, type PromoItem } from "./promoData";

const WA_KLINIK = "https://wa.me/6287878847788";

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
        <img src={iconTimer} alt="" width={20} height={20} />
        {promo.badge}
      </span>
      <div className="flex w-full flex-col gap-2.5 px-6">
        <h3 className="font-body text-2xl font-medium text-heading">
          {promo.title}
        </h3>
        <p className="font-body text-2xl font-medium text-brand-strong">
          {promo.price}
          {promo.compare ? (
            <span className="ml-2 text-sm font-normal text-muted line-through">
              {promo.compare}
            </span>
          ) : null}
        </p>
        <p className="flex items-center gap-1 font-body text-base leading-6 text-muted">
          <img src={iconCalendar} alt="" width={20} height={20} />
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
        <img src={iconWhatsappWhite} alt="" width={24} height={24} />
        Klaim Promo
      </a>
    </article>
  );
}
