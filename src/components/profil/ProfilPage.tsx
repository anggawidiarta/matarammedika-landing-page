import { MessageCircle } from "lucide-react";
import ContentCard from "@/components/profil/ContentCard";
import bannerTextureImg from "@/assets/photos/banner-texture.webp";
import { WA_KLINIK } from "@/data/site";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";

const aboutText =
  'Klinik Mataram Medika berkomitmen untuk memberikan kontribusi terhadap peningkatan kesehatan masyarakat di wilayah Mataram melalui layanan komprehensif. Dengan konsep "one stop service" , kami memudahkan akses ke berbagai layanan kesehatan yang mencakup deteksi dini penyakit, pencegahan, pengobatan, hingga terapi pemulihan. Sebagai unit usaha yang terdaftar dengan nama CV. Mataram Medika, Klinik Mataram Medika spesialisasi dalam layanan kesehatan dan terletak di Jalan Catur Warga No. 13, Mataram. Kami menyediakan layanan Rawat Darurat, Rawat Jalan, praktik dokter umum, dokter gigi, serta dokter spesialis';

const visionText =
  "Menjadi pusat layanan kesehatan terdepan di kota Mataram, Lombok, yang terus menerus berinovasi untuk memberikan pelayanan kesehatan berkualitas tinggi, terjangkau, dan mudah diakses oleh masyarakat lokal.";

const missionItems = [
  "Memberikan pelayanan kesehatan yang berkualitas dan komprehensif dengan menggunakan teknologi terkini dan tenaga medis yang profesional.",
  "Meningkatkan kesadaran dan pendidikan kesehatan di kalangan masyarakat lokal untuk mendukung gaya hidup yang lebih sehat.",
  "Membangun kerjasama yang kuat dengan stakeholders lokal untuk memperluas jangkauan dan efektivitas layanan kesehatan.",
  "Memastikan bahwa setiap individu, terlepas dari latar belakang ekonomi, memiliki akses ke layanan kesehatan yang baik.",
];

export default function ProfilKlinik() {
  return (
    <>
      <main className="page-container flex flex-col gap-10 pt-8 pb-24">
        <KlinikPageTitle
          title="Profile"
          caption="Ringkasan informasi tentang Klinik Mataram Medika"
        />

        <section className="flex flex-col gap-3">
          <h2 className="font-body text-xl leading-snug font-medium text-balance text-black sm:text-2xl">
            TENTANG KAMI
          </h2>
          <ContentCard>
            <p className="text-justify">{aboutText}</p>
          </ContentCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="font-body text-xl leading-snug font-medium text-balance text-black sm:text-2xl">
              VISI
            </h2>
            <ContentCard>
              <p className="text-justify">{visionText}</p>
            </ContentCard>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="font-body text-xl leading-snug font-medium text-balance text-black sm:text-2xl">
              MISI
            </h2>
            <ContentCard>
              <ol className="list-decimal space-y-0 pl-5">
                {missionItems.map((item) => (
                  <li key={item} className="text-justify">
                    {item}
                  </li>
                ))}
              </ol>
            </ContentCard>
          </div>
        </section>

        <section className="bg-gradient-blue-green relative flex min-h-[329px] flex-col items-center justify-center overflow-hidden rounded-[32px] px-8 py-12 text-center text-white lg:px-16">
          <img
            src={bannerTextureImg.src}
            width={bannerTextureImg.width}
            height={bannerTextureImg.height}
            loading="lazy"
            decoding="async"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.06]"
          />
          <div className="relative z-10 flex max-w-[747px] flex-col items-center gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="font-body text-[28px] leading-snug font-semibold text-balance sm:text-[32px] sm:leading-normal">
                Kontak Kami Untuk Reservasi Pelayanan kami sekarang
              </h2>
              <p className="font-body text-base leading-6 text-pretty opacity-80">
                Kesehatan Anda adalah prioritas kami. Reservasi pelayanan kami sekarang
                <br />
                dan dapatkan perawatan terbaik dari tenaga medis profesional.
              </p>
            </div>
            <a
              href={WA_KLINIK}
              className="font-accent text-blue shadow-cta inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-lg font-semibold"
            >
              <MessageCircle
                size={24}
                className="fill-green text-green"
                aria-hidden
                strokeWidth={1.5}
              />
              Reservasi
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
