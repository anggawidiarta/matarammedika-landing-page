import PromoCard from "@/components/shared/cards/PromoCard";
import type { PromoCardData } from "@/lib/cms/promoDisplay";

export default function PromoGrid({ promos }: { promos: PromoCardData[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {promos.map((promo) => (
        <PromoCard key={promo.id} promo={promo} />
      ))}
    </div>
  );
}
