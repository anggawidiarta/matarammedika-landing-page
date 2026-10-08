import IconFeatureCard from "@/components/klinik/cards/IconFeatureCard";
import { layananSpecialists, layananUmumGigi } from "@/components/klinik/data/layananData";
import KlinikPageShell from "@/components/klinik/layout/KlinikPageShell";
import KlinikPageTitle from "@/components/klinik/sections/KlinikPageTitle";
import { renderIcon } from "@/components/klinik/ui/iconDescriptor";

export default function LayananKlinik() {
  return (
    <KlinikPageShell activeLabel="Layanan">
      <main className="mx-auto flex max-w-[1228px] flex-col gap-10 px-6 pt-8 pb-24">
        <KlinikPageTitle
          title="Daftar Layanan"
          caption="Klinik kami menyediakan berbagai layanan kesehatan lengkap yang ditangani oleh tenaga medis profesional, memberikan perawatan terbaik bagi setiap pasien."
        />

        <section className="flex flex-col gap-6">
          <h2 className="font-body text-2xl font-medium leading-[21px] text-black">
            Konsultasi Dokter
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {[layananUmumGigi.umum, layananUmumGigi.gigi].map((item) => (
              <IconFeatureCard
                key={item.title}
                layout="inline"
                icon={renderIcon(item.icon)}
                title={item.title}
                body={item.body}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-body text-2xl font-medium leading-[21px] text-black">
            Konsultasi Dokter Spesialis
          </h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {layananSpecialists.map((item) => (
              <IconFeatureCard
                key={item.title}
                icon={renderIcon(item.icon)}
                title={item.title}
                body={item.body}
              />
            ))}
          </div>
        </section>
      </main>
    </KlinikPageShell>
  );
}
