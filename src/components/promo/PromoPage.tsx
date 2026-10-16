import PromoCard from "@/components/shared/cards/PromoCard";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";
import type { PromoCardData } from "@/lib/cms/promoDisplay";

export default function PromoKlinik({ promos }: { promos: PromoCardData[] }) {
  return (
    <>
      <main className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 pt-8 pb-24">
        <KlinikPageTitle
          align="start"
          title="Informasi Promo"
          caption="Kami menyediakan berbagai promo , Seperti"
        />

        {promos.length > 0 ? (
          <div className="grid gap-10 lg:grid-cols-3">
            {promos.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center font-body text-lg text-muted">
            Belum ada promo saat ini. Pantau terus halaman ini untuk promo terbaru kami.
          </p>
        )}
      </main>
    </>
  );
}
