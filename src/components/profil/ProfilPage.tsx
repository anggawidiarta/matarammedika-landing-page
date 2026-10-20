import { useState } from "react";
import { MessageCircle, Quote } from "lucide-react";
import ContentCard from "@/components/profil/ContentCard";
import { gradientBg } from "@/components/shared/ui/gradient";
import bannerTextureImg from "@/assets/photos/banner-texture.webp";
import Segmented from "@/components/shared/ui/Segmented";
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
    whatsapp: WA_KLINIK,
    ctaTitle: "Kontak Kami Untuk Reservasi Pelayanan kami sekarang",
    ctaBody:
      "Kesehatan Anda adalah prioritas kami. Reservasi pelayanan kami sekarang dan dapatkan perawatan terbaik dari tenaga medis profesional.",
    ctaLabel: "Reservasi",
  },
  apotek: {
    name: "Apotek Mataram Medika",
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
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
            <div className="flex flex-col gap-1">
              <SectionHeading>TENTANG KAMI</SectionHeading>
              <p className="font-body text-muted text-sm leading-6">{copy.name}</p>
            </div>
            <ContentCard>
              <p className="max-w-[72ch]">{about}</p>
            </ContentCard>
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
              <MessageCircle
                size={24}
                className="fill-green text-green"
                aria-hidden
                strokeWidth={1.5}
              />
              {copy.ctaLabel}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
