import { layananSpecialists, layananUmumGigi, type LayananItem } from "@/data/layanan";
import FeatureSection from "@/components/shared/cards/FeatureSection";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";

const FALLBACK_UMUM_GIGI = [layananUmumGigi.umum, layananUmumGigi.gigi];

export default function LayananKlinik({
  umumGigi = FALLBACK_UMUM_GIGI,
  specialists = layananSpecialists,
}: {
  umumGigi?: LayananItem[];
  specialists?: LayananItem[];
}) {
  return (
    <>
      <main className="page-container flex flex-col gap-10 pt-8 pb-24">
        <KlinikPageTitle
          title="Daftar Layanan"
          caption="Klinik kami menyediakan berbagai layanan kesehatan lengkap yang ditangani oleh tenaga medis profesional, memberikan perawatan terbaik bagi setiap pasien."
        />

        <FeatureSection
          title="Konsultasi Dokter"
          items={umumGigi}
          layout="inline"
          gridClassName="grid gap-5 lg:grid-cols-2"
        />

        <FeatureSection title="Konsultasi Dokter Spesialis" items={specialists} />
      </main>
    </>
  );
}
