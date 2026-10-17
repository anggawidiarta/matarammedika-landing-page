import PromoCard from "@/components/shared/cards/PromoCard";
import type { PromoCardData } from "@/lib/cms/promoDisplay";

export default function PromoGrid({ promos }: { promos: PromoCardData[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {promos.map((promo) => (
        <PromoCard key={promo.id} promo={promo} />
      ))}
    </div>
  );
}
