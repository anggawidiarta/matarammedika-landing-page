import PromoCard from "@/components/klinik/cards/PromoCard";
import { promoKlinikItems } from "@/components/klinik/data/promoData";
import KlinikPageShell from "@/components/klinik/layout/KlinikPageShell";
import KlinikPageTitle from "@/components/klinik/sections/KlinikPageTitle";

export default function PromoKlinik() {
  return (
    <KlinikPageShell activeLabel="Promo">
      <main className="mx-auto flex max-w-[1228px] flex-col gap-10 px-6 pt-8 pb-24">
        <KlinikPageTitle
          align="start"
          title="Informasi Promo"
          caption="Kami menyediakan berbagai promo , Seperti"
        />

        <div className="grid gap-10 lg:grid-cols-3">
          {promoKlinikItems.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      </main>
    </KlinikPageShell>
  );
}
