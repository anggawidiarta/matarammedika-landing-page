import type { FeatureItem } from "@/types/feature";
import FeatureSection from "@/components/shared/cards/FeatureSection";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";

export default function LayananKlinik({
  umumGigi,
  specialists,
}: {
  umumGigi: FeatureItem[];
  specialists: FeatureItem[];
}) {
  return (
    <>
      <main className="page-container flex flex-col gap-10 pt-8 pb-24">
        <KlinikPageTitle
          title="Daftar Layanan"
          caption="Klinik kami menyediakan berbagai layanan kesehatan lengkap yang ditangani oleh tenaga medis profesional, memberikan perawatan terbaik bagi setiap pasien."
        />

        {umumGigi.length > 0 && (
          <FeatureSection
            title="Konsultasi Dokter"
            items={umumGigi}
            layout="inline"
            gridClassName="grid gap-5 lg:grid-cols-2"
          />
        )}

        {specialists.length > 0 && (
          <FeatureSection title="Konsultasi Dokter Spesialis" items={specialists} />
        )}
      </main>
    </>
  );
}
