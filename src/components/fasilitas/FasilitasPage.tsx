import {
  fasilitasLainnya,
  fasilitasUmum,
  type FasilitasItem,
} from "@/data/fasilitas";
import FeatureSection from "@/components/shared/cards/FeatureSection";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";

export default function FasilitasKlinik({
  umum = fasilitasUmum,
  lainnya = fasilitasLainnya,
}: {
  umum?: FasilitasItem[];
  lainnya?: FasilitasItem[];
}) {
  return (
    <>
      <main className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 pt-8 pb-24">
        <KlinikPageTitle
          title="Daftar Fasilitas"
          caption="Klinik kami menyediakan berbagai fasilitas kesehatan lengkap"
        />

        <FeatureSection title="Fasilitas Umum" items={umum} />
        <FeatureSection title="Fasilitas Lainnya" items={lainnya} />
      </main>
    </>
  );
}
