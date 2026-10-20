import type { FeatureItem } from "@/types/feature";
import FeatureSection from "@/components/shared/cards/FeatureSection";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";

export default function FasilitasKlinik({
  umum,
  lainnya,
}: {
  umum: FeatureItem[];
  lainnya: FeatureItem[];
}) {
  return (
    <>
      <main className="page-container flex flex-col gap-10 pt-8 pb-24">
        <KlinikPageTitle
          title="Daftar Fasilitas"
          caption="Klinik kami menyediakan berbagai fasilitas kesehatan lengkap"
        />

        {umum.length > 0 && <FeatureSection title="Fasilitas Umum" items={umum} />}
        {lainnya.length > 0 && <FeatureSection title="Fasilitas Lainnya" items={lainnya} />}
      </main>
    </>
  );
}
