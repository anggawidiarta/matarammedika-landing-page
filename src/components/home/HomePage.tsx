import type { ReactNode } from "react";
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
import type { FeatureItem } from "@/types/feature";
import bannerFamilyImg from "@/assets/photos/banner-family.webp";
import bannerTextureImg from "@/assets/photos/banner-texture.webp";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";
import { ArrowIcon, GradientLink } from "@/components/shared/ui/GradientLink";
import { renderIcon } from "@/components/shared/ui/iconDescriptor";
import WhatsAppIcon from "@/components/shared/ui/WhatsAppIcon";

type AsuransiLogo = { name: string; src: string; width: number; height: number };

const asuransiRowOne: AsuransiLogo[] = [
  { name: "Owlexa Healthcare", src: owlexa.src, width: 146, height: 45 },
  { name: "BCA Life", src: bcaLife.src, width: 142, height: 80 },
  { name: "Mandiri Inhealth", src: mandiriInhealth.src, width: 158, height: 58 },
  { name: "PLN Insurance", src: pln.src, width: 114, height: 80 },
  { name: "BNI Life", src: bniLife.src, width: 152, height: 78 },
];

const asuransiRowTwo: AsuransiLogo[] = [
  { name: "Garda Medika", src: bni.src, width: 114, height: 46 },
  { name: "AdMedika", src: admedika.src, width: 167, height: 33 },
  { name: "Telkomedika", src: telkomedika.src, width: 129, height: 64 },
  { name: "BRI Life", src: briLife.src, width: 172, height: 66 },
  { name: "CAR Life Insurance", src: bri.src, width: 152, height: 42 },
  { name: "YKKBI", src: ykkbi.src, width: 122, height: 66 },
];

function AsuransiRow({ logos }: { logos: AsuransiLogo[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-[68px]">
      {logos.map((logo) => (
        <img
          key={logo.src}
          src={logo.src}
          alt={logo.name}
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
      <KlinikPageTitle
        as="h2"
        align="start"
        showSegmented={false}
        title={title}
        caption={caption}
      />
      <GradientLink href={href}>
        Lihat Selengkapnya
        <ArrowIcon />
      </GradientLink>
    </div>
  );
}

export default function LandingPageKlinik({
  children,
  layananPreview,
  fasilitasPreview,
  promoPreview = [],
}: {
  children: ReactNode;
  layananPreview: FeatureItem[];
  fasilitasPreview: FeatureItem[];
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
            showSegmented={false}
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
            showSegmented={false}
            title="Daftar Layanan"
            caption="Klinik kami menyediakan berbagai layanan kesehatan lengkap yang ditangani oleh tenaga medis profesional, memberikan perawatan terbaik bagi setiap pasien."
          />
          <div>
            <h3 className="text-xl font-medium leading-snug font-body text-balance text-heading sm:text-2xl">
              Layanan Klinik
            </h3>
            <p className="text-sm leading-6 font-body text-pretty text-heading/70">
              Solusi kesehatan terpadu untuk keluarga Anda.
            </p>
          </div>
          {layananPreview.length > 0 ? (
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
          ) : (
            <p className="py-10 text-center font-body text-lg text-heading/70">
              Daftar layanan belum tersedia saat ini.
            </p>
          )}
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-blue bg-surface-highlight px-8 py-5 shadow-card lg:min-h-[124px] lg:flex-row lg:items-center">
            <div className="flex gap-6 items-center">
              {renderIcon({
                kind: "lucideCircle",
                name: "userSearch",
                tone: "blue",
              })}
              <div>
                <p className="text-xl font-medium leading-snug text-heading font-body text-balance sm:text-2xl">
                  Belum menemukan layanan yang dicari?
                </p>
                <p className="mt-3 text-sm leading-6 font-accent text-pretty text-heading/70">
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
          <h3 className="text-xl font-medium leading-snug font-body text-balance text-heading sm:text-2xl">
            Fasilitas Klinik
          </h3>
          {fasilitasPreview.length > 0 ? (
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
          ) : (
            <p className="py-10 text-center font-body text-lg text-heading/70">
              Daftar fasilitas belum tersedia saat ini.
            </p>
          )}
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
            <p className="py-10 text-center font-body text-lg text-heading/70">
              Belum ada promo aktif saat ini.
            </p>
          )}

          <div className="relative mt-6 flex min-h-[329px] flex-col overflow-hidden rounded-[32px] bg-linear-to-br from-promo to-promo-red text-white lg:flex-row lg:items-center">
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
                className="inline-flex min-h-12 gap-2 items-center px-7 py-4 text-lg font-semibold bg-white rounded-full w-fit font-accent text-promo shadow-cta transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-safe:active:scale-[0.97] motion-reduce:transition-none"
              >
                <WhatsAppIcon className="bg-promo" />
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
