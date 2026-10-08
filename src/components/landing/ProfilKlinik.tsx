import type { ReactNode } from "react";
import { bannerTexture, iconWhatsapp } from "./assets";
import SiteFooter from "./SiteFooter";
import { Logo, Segmented, gradientBg } from "./ui";

const WA_KLINIK = "https://wa.me/6287878847788";

const nav = [
  { label: "Beranda", href: "/" },
  { label: "Dokter", href: "/#dokter" },
  { label: "Layanan", href: "/layanan-klinik" },
  { label: "Fasilitas", href: "/fasilitas-klinik" },
  { label: "Promo", href: "/promo-klinik" },
  { label: "Profil", href: "/profil-klinik" },
];

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

function ContentCard({ children }: { children: ReactNode }) {
  return (
    <article className="px-8 py-5 bg-white rounded-3xl shadow-card">
      <p className="text-sm leading-5 text-justify font-body text-muted">
        {children}
      </p>
    </article>
  );
}

export default function ProfilKlinik() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-surface font-body text-heading">
      <header className="bg-surface">
        <div className="mx-auto flex max-w-[1440px] justify-center px-4 py-4 lg:px-10">
          <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 rounded-[40px] bg-white px-6 py-4 shadow-nav lg:px-10">
            <a href="/" aria-label="Beranda">
              <Logo />
            </a>
            <nav className="flex flex-wrap gap-6 justify-center items-center text-base lg:gap-10">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={
                    item.label === "Profil"
                      ? "font-bold text-brand"
                      : "text-muted opacity-80"
                  }
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              href="/#kontak"
              className={`inline-flex justify-center items-center px-7 py-4 text-lg font-semibold text-white rounded-full ${gradientBg} w-[179px] font-body shadow-cta`}
            >
              Informasi
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1228px] flex-col gap-10 px-6 pt-8 pb-24">
        <div className="flex flex-col gap-3 items-center text-center">
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <h1 className="font-body text-[32px] font-semibold text-heading">
              Profile
            </h1>
            <Segmented active="klinik" />
          </div>
          <p className="max-w-[721px] font-body text-base leading-6 text-muted opacity-80">
            Ringkasan informasi tentang Klinik Mataram Medika
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="font-body text-2xl font-medium leading-[21px] text-black">
            TENTANG KAMI
          </h2>
          <ContentCard>{aboutText}</ContentCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="font-body text-2xl font-medium leading-[21px] text-black">
              VISI
            </h2>
            <ContentCard>{visionText}</ContentCard>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="font-body text-2xl font-medium leading-[21px] text-black">
              MISI
            </h2>
            <article className="px-8 py-5 bg-white rounded-3xl shadow-card">
              <ol className="pl-5 space-y-0 text-sm leading-5 list-decimal font-body text-muted">
                {missionItems.map((item) => (
                  <li key={item} className="text-justify">
                    {item}
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </section>

        <section className="relative flex min-h-[329px] flex-col items-center justify-center overflow-hidden rounded-[32px] bg-gradient-brand px-8 py-12 text-center text-white lg:px-16">
          <img
            src={bannerTexture}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.06]"
          />
          <div className="relative z-10 flex max-w-[747px] flex-col items-center gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="font-body text-[32px] font-semibold leading-normal">
                Kontak Kami Untuk Reservasi Pelayanan kami sekarang
              </h2>
              <p className="text-base leading-6 opacity-80 font-body">
                Kesehatan Anda adalah prioritas kami. Reservasi pelayanan kami
                sekarang
                <br />
                dan dapatkan perawatan terbaik dari tenaga medis profesional.
              </p>
            </div>
            <a
              href={WA_KLINIK}
              className="inline-flex gap-2 items-center px-7 py-4 text-lg font-semibold bg-white rounded-full font-accent text-brand shadow-cta"
            >
              <img src={iconWhatsapp} alt="" width={24} height={24} />
              Reservasi
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
