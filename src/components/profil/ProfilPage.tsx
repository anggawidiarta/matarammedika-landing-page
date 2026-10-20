import { useState } from "react";
import { Pill, Quote, Stethoscope } from "lucide-react";
import ContentCard from "@/components/profil/ContentCard";
import { gradientBg } from "@/components/shared/ui/gradient";
import bannerTextureImg from "@/assets/photos/banner-texture.webp";
import profilApotekImg from "@/assets/photos/profil-apotek.webp";
import profilKlinikImg from "@/assets/photos/profil-klinik.webp";
import Segmented from "@/components/shared/ui/Segmented";
import WhatsAppIcon from "@/components/shared/ui/WhatsAppIcon";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";
import type { ProfilContent, ProfilUnit } from "@/lib/cms/types";
import { WA_APOTEK, WA_KLINIK } from "@/data/site";

type ProfilPageProps = {
  content: Record<ProfilUnit, ProfilContent>;
  initialUnit: ProfilUnit;
};

const UNIT_COPY = {
  klinik: {
    name: "Klinik Mataram Medika",
    Icon: Stethoscope,
    photo: profilKlinikImg,
    photoAlt: "Ruang resepsi Klinik Mataram Medika dengan logo menyala di dinding",
    whatsapp: WA_KLINIK,
    ctaTitle: "Kontak Kami Untuk Reservasi Pelayanan kami sekarang",
    ctaBody:
      "Kesehatan Anda adalah prioritas kami. Reservasi pelayanan kami sekarang dan dapatkan perawatan terbaik dari tenaga medis profesional.",
    ctaLabel: "Reservasi",
  },
  apotek: {
    name: "Apotek Mataram Medika",
    Icon: Pill,
    photo: profilApotekImg,
    photoAlt: "Tampak depan Apotek dan Klinik Mataram Medika di Jalan Catur Warga, Mataram",
    whatsapp: WA_APOTEK,
    ctaTitle: "Hubungi Apotek Kami untuk Pemesanan Obat",
    ctaBody:
      "Tanyakan ketersediaan obat dan produk kesehatan, langsung ke apoteker kami dengan harga yang terjangkau.",
    ctaLabel: "Hubungi Apotek",
  },
} as const;

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="font-body text-heading text-xl leading-snug font-semibold text-balance sm:text-2xl">
      {children}
    </h2>
  );
}

export default function ProfilPage({ content, initialUnit }: ProfilPageProps) {
  const [unit, setUnit] = useState<ProfilUnit>(initialUnit);
  const { about, vision, missions } = content[unit];
  const copy = UNIT_COPY[unit];

  const handleUnitChange = (next: ProfilUnit) => {
    setUnit(next);
    const url = new URL(window.location.href);
    if (next === "klinik") url.searchParams.delete("unit");
    else url.searchParams.set("unit", next);
    window.history.replaceState(null, "", url);
  };

  return (
    <main className="page-container flex flex-col gap-12 pt-8 pb-24">
      <div className="flex flex-col items-center gap-3 text-center">
        <KlinikPageTitle
          title="Profile"
          caption={`Ringkasan informasi tentang ${copy.name}`}
          showSegmented={false}
        />
        <Segmented active={unit} onChange={handleUnitChange} />
      </div>

      <div key={unit} className="profil-panel-in flex flex-col gap-12">
        {about && (
          <section className="shadow-card grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <img
              src={copy.photo.src}
              width={copy.photo.width}
              height={copy.photo.height}
              alt={copy.photoAlt}
              decoding="async"
              className="h-56 w-full object-cover sm:h-72 lg:h-full lg:min-h-[400px]"
            />
            <div className="flex flex-col justify-center gap-5 px-6 py-8 sm:px-8 lg:gap-6 lg:px-12 lg:py-12">
              <div className="flex items-center gap-4">
                <span
                  className={`${gradientBg} shadow-cta flex size-14 shrink-0 items-center justify-center rounded-full text-white`}
                  aria-hidden
                >
                  <copy.Icon size={28} strokeWidth={1.75} />
                </span>
                <div className="flex flex-col gap-1">
                  <SectionHeading>TENTANG KAMI</SectionHeading>
                  <p className="font-body text-heading/70 text-sm leading-6 sm:text-base">
                    {copy.name}
                  </p>
                </div>
              </div>
              <p className="font-body text-heading/80 text-base leading-7 text-pretty lg:text-lg lg:leading-8">
                {about}
              </p>
            </div>
          </section>
        )}

        {(vision || missions.length > 0) && (
          <section className="grid gap-x-6 gap-y-12 lg:grid-cols-[5fr_7fr]">
            {vision && (
              <div className="flex flex-col gap-3">
                <SectionHeading>VISI</SectionHeading>
                <div
                  className={`${gradientBg} shadow-cta relative flex flex-1 flex-col justify-center gap-5 overflow-hidden rounded-3xl px-6 py-8 text-white sm:px-8 sm:py-10`}
                >
                  <img
                    src={bannerTextureImg.src}
                    width={bannerTextureImg.width}
                    height={bannerTextureImg.height}
                    loading="lazy"
                    decoding="async"
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.06]"
                  />
                  <Quote size={36} strokeWidth={1.5} className="relative opacity-60" aria-hidden />
                  <p className="font-body relative text-xl leading-snug font-medium text-balance sm:text-2xl sm:leading-snug">
                    {vision}
                  </p>
                </div>
              </div>
            )}
            {missions.length > 0 && (
              <div className={`flex flex-col gap-3 ${vision ? "" : "lg:col-span-2"}`}>
                <SectionHeading>MISI</SectionHeading>
                <ContentCard className="flex-1">
                  <ol className="flex flex-col gap-5">
                    {missions.map((item, index) => (
                      <li key={item} className="flex items-start gap-4">
                        <span
                          className={`${gradientBg} font-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white tabular-nums`}
                          aria-hidden
                        >
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{item}</span>
                      </li>
                    ))}
                  </ol>
                </ContentCard>
              </div>
            )}
          </section>
        )}

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
                {copy.ctaTitle}
              </h2>
              <p className="font-body mx-auto max-w-[56ch] text-base leading-6 text-pretty opacity-90">
                {copy.ctaBody}
              </p>
            </div>
            <a
              href={copy.whatsapp}
              className="font-accent text-blue shadow-cta inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-lg font-semibold transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.97] motion-reduce:transition-none"
            >
              <WhatsAppIcon className="bg-green" />
              {copy.ctaLabel}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
