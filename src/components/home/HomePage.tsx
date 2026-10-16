import type { ReactNode } from "react";
import { fasilitasUmum, type FasilitasItem } from "@/data/fasilitas";
import { layananHomePreview, type LayananItem } from "@/data/layanan";
import IconFeatureCard from "@/components/shared/cards/IconFeatureCard";
import PromoGrid from "@/components/shared/sections/PromoGrid";
import admedika from "@/assets/asuransi/admedika.webp";
import bcaLife from "@/assets/asuransi/bca-life.webp";
import bni from "@/assets/asuransi/bni.webp";
import bniLife from "@/assets/asuransi/bni-life.webp";
import bri from "@/assets/asuransi/bri.webp";
import briLife from "@/assets/asuransi/bri-life.webp";
import mandiriInhealth from "@/assets/asuransi/mandiri-inhealth.webp";
import owlexa from "@/assets/asuransi/owlexa.webp";
import pln from "@/assets/asuransi/pln.webp";
import telkomedika from "@/assets/asuransi/telkomedika.webp";
import ykkbi from "@/assets/asuransi/ykkbi.webp";
import { WA_KLINIK } from "@/data/site";
import type { PromoCardData } from "@/lib/cms/promoDisplay";
import bannerFamilyImg from "@/assets/photos/banner-family.webp";
import bannerTextureImg from "@/assets/photos/banner-texture.webp";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";
import { ArrowIcon, GradientLink } from "@/components/shared/ui/GradientLink";
import { renderIcon } from "@/components/shared/ui/iconDescriptor";
import { MessageCircle } from "lucide-react";

type AsuransiLogo = { src: string; width: number; height: number };

const asuransiRowOne: AsuransiLogo[] = [
  { src: owlexa.src, width: 146, height: 45 },
  { src: bcaLife.src, width: 142, height: 80 },
  { src: mandiriInhealth.src, width: 158, height: 58 },
  { src: pln.src, width: 114, height: 80 },
  { src: bniLife.src, width: 152, height: 78 },
];

const asuransiRowTwo: AsuransiLogo[] = [
  { src: bni.src, width: 114, height: 46 },
  { src: admedika.src, width: 167, height: 33 },
  { src: telkomedika.src, width: 129, height: 64 },
  { src: briLife.src, width: 172, height: 66 },
  { src: bri.src, width: 152, height: 42 },
  { src: ykkbi.src, width: 122, height: 66 },
];

function AsuransiRow({ logos }: { logos: AsuransiLogo[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-[68px]">
      {logos.map((logo) => (
        <img
          key={logo.src}
          src={logo.src}
          alt=""
          width={logo.width}
          height={logo.height}
          loading="lazy"
          decoding="async"
          className="object-contain"
        />
      ))}
    </div>
  );
}

function SectionTitleWithLink({
  title,
  caption,
  href,
}: {
  title: string;
  caption: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-6 justify-between items-start lg:flex-row lg:items-center">
      <KlinikPageTitle as="h2" align="start" title={title} caption={caption} />
      <GradientLink href={href}>
        Lihat Selengkapnya
        <ArrowIcon />
      </GradientLink>
    </div>
  );
}

export default function LandingPageKlinik({
  children,
  layananPreview = layananHomePreview,
  fasilitasPreview = fasilitasUmum,
  promoPreview = [],
}: {
  children: ReactNode;
  layananPreview?: LayananItem[];
  fasilitasPreview?: FasilitasItem[];
  promoPreview?: PromoCardData[];
}) {
  return (
    <>
      <section id="beranda" className="bg-surface-tint">
        <div className="page-container grid items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_413px] lg:justify-between lg:gap-16 xl:gap-24 lg:pb-24 lg:pt-10">
          {children}
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="page-container flex flex-col items-center gap-10">
          <KlinikPageTitle
            as="h2"
            title="Kerjasama Asuransi"
            caption="Kami telah bekerjasama dengan beberapa pihak asuransi, seperti"
          />
          <div className="flex flex-col gap-10 items-center">
            <AsuransiRow logos={asuransiRowOne} />
            <AsuransiRow logos={asuransiRowTwo} />
          </div>
        </div>
      </section>

      <section id="layanan" className="py-20 bg-surface-tint">
        <div className="page-container flex flex-col gap-10">
          <KlinikPageTitle
            as="h2"
            title="Daftar Layanan"
            caption="Klinik kami menyediakan berbagai layanan kesehatan lengkap yang ditangani oleh tenaga medis profesional, memberikan perawatan terbaik bagi setiap pasien."
          />
          <div>
            <h3 className="text-xl font-medium leading-snug font-body text-balance text-heading sm:text-2xl">
              Layanan Klinik
            </h3>
            <p className="text-sm leading-6 font-body text-pretty text-muted">
              Solusi kesehatan terpadu untuk keluarga Anda.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {layananPreview.map((service) => (
              <IconFeatureCard
                key={service.title}
                icon={renderIcon(service.icon)}
                title={service.title}
                body={service.body}
              />
            ))}
          </div>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-blue bg-surface-highlight px-8 py-5 shadow-card lg:h-[124px] lg:flex-row lg:items-center">
            <div className="flex gap-6 items-center">
              {renderIcon({
                kind: "lucideCircle",
                name: "userSearch",
                tone: "blue",
              })}
              <div>
                <p className="text-xl font-medium leading-snug text-black font-body text-balance sm:text-2xl">
                  Belum menemukan layanan yang dicari?
                </p>
                <p className="mt-3 text-sm leading-6 font-accent text-pretty text-muted">
                  Telusuri fasilitas layanan klinik kami selengkapnya.
                </p>
              </div>
            </div>
            <GradientLink href="/layanan-klinik">
              Lihat Selengkapnya
              <ArrowIcon />
            </GradientLink>
          </div>
        </div>
      </section>

      <section id="fasilitas" className="py-20 bg-surface">
        <div className="page-container flex flex-col gap-10">
          <SectionTitleWithLink
            title="Daftar Fasilitas"
            caption="Klinik kami menyediakan berbagai fasilitas kesehatan lengkap"
            href="/fasilitas-klinik"
          />
          <h3 className="text-xl font-medium leading-snug font-body text-balance sm:text-2xl">
            Fasilitas Klinik
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {fasilitasPreview.map((item) => (
              <IconFeatureCard
                key={item.title}
                titleSize="xl"
                icon={renderIcon(item.icon)}
                title={item.title}
                body={item.body}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="promo" className="py-20 bg-surface-tint">
        <div className="page-container flex flex-col gap-10">
          <SectionTitleWithLink
            title="Informasi Promo"
            caption="Layanan kesehatan berkualitas dengan harga lebih hemat. Klaim sebelum waktunya habis."
            href="/promo-klinik"
          />
          {promoPreview.length > 0 ? (
            <PromoGrid promos={promoPreview} />
          ) : (
            <p className="py-10 text-center font-body text-lg text-muted">
              Belum ada promo aktif saat ini.
            </p>
          )}

          <div className="relative mt-6 flex min-h-[329px] flex-col overflow-hidden rounded-[32px] bg-gradient-promo text-white lg:flex-row lg:items-center">
            <img
              src={bannerTextureImg.src}
              width={bannerTextureImg.width}
              height={bannerTextureImg.height}
              loading="lazy"
              decoding="async"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.06]"
            />
            <div className="relative z-10 flex max-w-[640px] flex-col gap-10 px-8 py-12 lg:px-[68px] lg:py-[54px]">
              <div>
                <h2 className="font-body text-[28px] font-semibold leading-snug text-balance sm:text-[32px] sm:leading-normal">
                  PROMO VAKSI DPT POLIO
                </h2>
                <p className="mt-2 text-xl leading-snug font-body text-pretty sm:text-2xl sm:leading-snug">
                  Lindungi si kecil Sekarang!
                  <br />
                  Imunisasi Lengkap untuk Buah Hati
                </p>
              </div>
              <a
                href={WA_KLINIK}
                className="inline-flex gap-2 items-center px-7 py-4 text-lg font-semibold bg-white rounded-full w-fit font-accent text-promo-cta"
              >
                <MessageCircle
                  size={24}
                  className="fill-promo-cta text-promo-cta"
                  aria-hidden
                  strokeWidth={1.5}
                />
                Klaim Promo
              </a>
            </div>
            <img
              src={bannerFamilyImg.src}
              alt="Imunisasi anak di klinik"
              width={576}
              height={329}
              loading="lazy"
              decoding="async"
              className="relative z-10 h-[260px] w-full object-cover lg:ml-auto lg:h-82.25 lg:w-xl"
            />
          </div>
        </div>
      </section>
    </>
  );
}
