import IconFeatureCard from "@/components/klinik/cards/IconFeatureCard";
import {
  fasilitasLainnya,
  fasilitasUmum,
  type FasilitasItem,
} from "@/components/klinik/data/fasilitasData";
import KlinikPageShell from "@/components/klinik/layout/KlinikPageShell";
import KlinikPageTitle from "@/components/klinik/sections/KlinikPageTitle";
import { renderIcon } from "@/components/klinik/ui/iconDescriptor";

function FeatureSection({ title, items }: { title: string; items: FasilitasItem[] }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-body text-2xl font-medium leading-[21px] text-black">
        {title}
      </h2>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <IconFeatureCard
            key={item.title}
            icon={renderIcon(item.icon)}
            title={item.title}
            body={item.body}
          />
        ))}
      </div>
    </section>
  );
}

export default function FasilitasKlinik() {
  return (
    <KlinikPageShell activeLabel="Fasilitas">
      <main className="mx-auto flex max-w-[1228px] flex-col gap-10 px-6 pt-8 pb-24">
        <KlinikPageTitle
          title="Daftar Fasilitas"
          caption="Klinik kami menyediakan berbagai fasilitas kesehatan lengkap"
        />

        <FeatureSection title="Fasilitas Umum" items={fasilitasUmum} />
        <FeatureSection title="Fasilitas Lainnya" items={fasilitasLainnya} />
      </main>
    </KlinikPageShell>
  );
}
