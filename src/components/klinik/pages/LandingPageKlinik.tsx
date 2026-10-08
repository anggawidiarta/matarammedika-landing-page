import {
  badgeGlow,
  bannerFamily,
  bannerTexture,
  doctor,
  doctorMask,
  heroCircle,
  heroOutline,
  heroShape,
  insurerAdmedika,
  insurerBcaLife,
  insurerBni,
  insurerBniLife,
  insurerBri,
  insurerBriLife,
  insurerMandiriInhealth,
  insurerOwlexa,
  insurerPln,
  insurerTelkomedika,
  insurerYkkbi,
} from "@/components/klinik/data/assets";
import { WA_KLINIK } from "@/components/klinik/data/constants";
import { fasilitasUmum } from "@/components/klinik/data/fasilitasData";
import { layananHomePreview } from "@/components/klinik/data/layananData";
import { promoKlinikPreview } from "@/components/klinik/data/promoData";
import IconFeatureCard from "@/components/klinik/cards/IconFeatureCard";
import PromoCard from "@/components/klinik/cards/PromoCard";
import KlinikPageShell from "@/components/klinik/layout/KlinikPageShell";
import KlinikPageTitle from "@/components/klinik/sections/KlinikPageTitle";
import {
  ArrowIcon,
  GradientLink,
  Segmented,
  Stethoscope,
} from "@/components/klinik/ui";
import { renderIcon } from "@/components/klinik/ui/iconDescriptor";
import { MessageCircle } from "lucide-react";

type InsurerLogo = { src: string; width: number; height: number };

const insurersRowOne: InsurerLogo[] = [
  { src: insurerOwlexa, width: 146, height: 45 },
  { src: insurerBcaLife, width: 142, height: 80 },
  { src: insurerMandiriInhealth, width: 158, height: 58 },
  { src: insurerPln, width: 114, height: 80 },
  { src: insurerBniLife, width: 152, height: 78 },
];

const insurersRowTwo: InsurerLogo[] = [
  { src: insurerBni, width: 114, height: 46 },
  { src: insurerAdmedika, width: 167, height: 33 },
  { src: insurerTelkomedika, width: 129, height: 64 },
  { src: insurerBriLife, width: 172, height: 66 },
  { src: insurerBri, width: 152, height: 42 },
  { src: insurerYkkbi, width: 122, height: 66 },
];

function InsurerRow({ logos }: { logos: InsurerLogo[] }) {
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

export default function LandingPageKlinik() {
  return (
    <KlinikPageShell activeLabel="Beranda" navVariant="home" headerTone="tint">
      <section id="beranda" className="bg-surface-tint">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-12 lg:grid-cols-[minmax(0,688px)_413px] lg:justify-center lg:gap-24 lg:px-[106px] lg:pb-24 lg:pt-10">
          <div>
            <Segmented active="klinik" />
            <h1 className="mt-[72px] max-w-[688px] bg-gradient-blue-green-text bg-clip-text font-body text-[40px] font-bold leading-normal text-transparent">
              Klinik Mataram Medika
            </h1>
            <p className="mt-4 max-w-[655px] font-body text-base leading-6 text-muted">
              Layanan kesehatan terpadu untuk keluarga Anda — dari rawat jalan
              dan konsultasi spesialis hingga fasilitas nyaman, dengan tenaga
              medis profesional di Mataram.
            </p>
            <div className="mt-8">
              <GradientLink href="#layanan">
                <Stethoscope />
                Lihat Layanan
              </GradientLink>
            </div>
          </div>

          <div className="relative mx-auto h-[520px] w-[min(100%,360px)] overflow-hidden sm:h-[582px] sm:w-[413px] sm:overflow-visible">
            <img
              src={heroShape}
              alt=""
              width={249.336}
              height={249.417}
              className="pointer-events-none absolute left-[20%] top-[27%]"
            />
            <img
              src={heroOutline}
              alt=""
              width={377.455}
              height={506.38}
              className="pointer-events-none absolute left-[9%] top-[13%]"
            />
            <img
              src={heroCircle}
              alt=""
              width={372.416}
              height={372.536}
              className="pointer-events-none absolute left-0 top-[21%]"
            />
            <img
              src={doctor}
              alt="dr. Kristopher May Pamudji, Spesialis Anak"
              width={321}
              height={490}
              fetchPriority="high"
              className="absolute left-[9%] top-0 h-[490px] w-[321px] object-cover object-top"
              style={{
                maskImage: `url("${doctorMask}")`,
                WebkitMaskImage: `url("${doctorMask}")`,
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskSize: "380px 381px",
                WebkitMaskSize: "380px 381px",
                maskPosition: "center 40px",
                WebkitMaskPosition: "center 40px",
              }}
            />
            <div className="absolute bottom-[16%] left-0 flex items-center gap-4 rounded-lg bg-white px-4 py-3.5 shadow-float">
              <span className="relative size-8">
                <img
                  src={badgeGlow}
                  alt=""
                  width={70}
                  height={70}
                  className="absolute left-[-19px] top-[-15px]"
                />
                <span className="absolute left-1 top-[3px]">
                  <Stethoscope />
                </span>
              </span>
              <span>
                <span className="block text-base font-semibold font-body text-heading">
                  dr. Kristopher May Pamudji
                </span>
                <span className="block text-xs font-body text-muted">
                  Spesialis Anak
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="mx-auto flex max-w-[1228px] flex-col items-center gap-10 px-6">
          <KlinikPageTitle
            as="h2"
            title="Kerjasama Asuransi"
            caption="Kami telah bekerjasama dengan beberapa pihak asuransi, seperti"
          />
          <div className="flex flex-col gap-10 items-center">
            <InsurerRow logos={insurersRowOne} />
            <InsurerRow logos={insurersRowTwo} />
          </div>
        </div>
      </section>

      <section id="layanan" className="py-20 bg-surface-tint">
        <div className="mx-auto flex max-w-[1228px] flex-col gap-10 px-6">
          <KlinikPageTitle
            as="h2"
            title="Daftar Layanan"
            caption="Klinik kami menyediakan berbagai layanan kesehatan lengkap yang ditangani oleh tenaga medis profesional, memberikan perawatan terbaik bagi setiap pasien."
          />
          <div>
            <h3 className="text-2xl font-medium leading-10 font-body text-heading">
              Layanan Klinik
            </h3>
            <p className="text-sm leading-5 font-body text-muted">
              Solusi kesehatan terpadu untuk keluarga Anda.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {layananHomePreview.map((service) => (
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
                <p className="font-body text-2xl font-medium leading-[21px] text-black">
                  Belum menemukan layanan yang dicari?
                </p>
                <p className="mt-3 text-sm leading-5 font-accent text-muted">
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
        <div className="mx-auto flex max-w-[1228px] flex-col gap-10 px-6">
          <SectionTitleWithLink
            title="Daftar Fasilitas"
            caption="Klinik kami menyediakan berbagai fasilitas kesehatan lengkap"
            href="/fasilitas-klinik"
          />
          <h3 className="font-body text-2xl font-medium leading-[21px]">
            Fasilitas Klinik
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {fasilitasUmum.map((item) => (
              <IconFeatureCard
                key={item.title}
                titleSize="xl"
                bodyClassName="font-body text-xs leading-5 text-muted"
                icon={renderIcon(item.icon)}
                title={item.title}
                body={item.body}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="promo" className="py-20 bg-surface-tint">
        <div className="mx-auto flex max-w-[1228px] flex-col gap-10 px-6">
          <SectionTitleWithLink
            title="Informasi Promo"
            caption="Kami menyediakan berbagai promo , Seperti"
            href="/promo-klinik"
          />
          <div className="grid gap-10 lg:grid-cols-3">
            {promoKlinikPreview.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </div>

          <div className="relative mt-6 flex min-h-[329px] flex-col overflow-hidden rounded-[32px] bg-gradient-promo text-white lg:flex-row lg:items-center">
            <img
              src={bannerTexture}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.06]"
            />
            <div className="relative z-10 flex max-w-[640px] flex-col gap-10 px-8 py-12 lg:px-[68px] lg:py-[54px]">
              <div>
                <h2 className="font-body text-[32px] font-semibold leading-normal">
                  PROMO VAKSI DPT POLIO
                </h2>
                <p className="mt-2 font-body text-2xl leading-[34px]">
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
              src={bannerFamily}
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
    </KlinikPageShell>
  );
}
