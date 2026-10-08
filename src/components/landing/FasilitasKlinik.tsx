import type { ReactNode } from "react";
import {
  iconCircleBlue,
  iconCircleMint,
  iconCircleRed,
  iconFacilityAdmin,
  iconFacilityCctv,
  iconFacilityDoctor,
  iconFacilityNoSmoking,
  iconFacilityNurse,
  iconFacilityWait,
  iconFire,
  iconHandSanitizer,
  iconToilet,
} from "./assets";
import { Logo, Segmented, gradientBg } from "./ui";
import SiteFooter from "./SiteFooter";

const nav = [
  { label: "Beranda", href: "/" },
  { label: "Dokter", href: "/#dokter" },
  { label: "Layanan", href: "/layanan-klinik" },
  { label: "Fasilitas", href: "/fasilitas-klinik" },
  { label: "Promo", href: "/promo-klinik" },
  { label: "Profil", href: "/profil-klinik" },
];

function CircleIcon({
  circle,
  glyph,
  glyphWidth,
  glyphHeight,
}: {
  circle: string;
  glyph: string;
  glyphWidth: number;
  glyphHeight: number;
}) {
  return (
    <span className="inline-block relative size-20 shrink-0">
      <img src={circle} alt="" width={80} height={80} />
      <span className="absolute top-4.75 left-4.75 flex size-10.25 items-center justify-center">
        <img src={glyph} alt="" width={glyphWidth} height={glyphHeight} />
      </span>
    </span>
  );
}

const generalFacilities = [
  {
    title: "Administrasi",
    body: "Loket pendaftaran, informasi, dan pembayaran pasien.",
    icon: <img src={iconFacilityAdmin} alt="" width={80} height={80} />,
  },
  {
    title: "Ruang Tunggu",
    body: "Area menunggu yang nyaman dengan fasilitas dasar.",
    icon: <img src={iconFacilityWait} alt="" width={80} height={80} />,
  },
  {
    title: "Ruang Menyusui",
    body: "Ruang privat untuk ibu menyusui dengan kenyamanan memadai.",
    icon: <img src={iconFacilityNurse} alt="" width={80} height={80} />,
  },
  {
    title: "Ruang Praktik Dokter",
    body: "Tempat dokter melakukan pemeriksaan dan konsultasi.",
    icon: <img src={iconFacilityDoctor} alt="" width={80} height={80} />,
  },
  {
    title: "Toilet",
    body: "Toilet bersih dengan fasilitas kebersihan lengkap.",
    icon: (
      <CircleIcon
        circle={iconCircleBlue}
        glyph={iconToilet}
        glyphWidth={33.75}
        glyphHeight={37.1667}
      />
    ),
  },
];

const otherFacilities = [
  {
    title: "Handsanitizer",
    body: "Tersedia di berbagai titik untuk menjaga kebersihan tangan pengunjung.",
    icon: (
      <CircleIcon
        circle={iconCircleMint}
        glyph={iconHandSanitizer}
        glyphWidth={25.934}
        glyphHeight={36.1667}
      />
    ),
  },
  {
    title: "Pemadam Api (APAR)",
    body: "Peralatan keselamatan untuk penanganan darurat kebakaran.",
    icon: (
      <CircleIcon
        circle={iconCircleRed}
        glyph={iconFire}
        glyphWidth={31.0296}
        glyphHeight={38.3128}
      />
    ),
  },
  {
    title: "CCTV",
    body: "Sistem kamera pengawas untuk keamanan seluruh area klinik.",
    icon: <img src={iconFacilityCctv} alt="" width={80} height={80} />,
  },
  {
    title: "Zona Bebas Rokok",
    body: "Area klinik sepenuhnya bebas rokok demi kenyamanan dan kesehatan bersama.",
    icon: <img src={iconFacilityNoSmoking} alt="" width={80} height={80} />,
  },
];

function FacilityCard({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: ReactNode;
}) {
  return (
    <article className="flex flex-col gap-6 rounded-3xl bg-white px-8 py-5 shadow-card">
      {icon}
      <div className="flex flex-col gap-3">
        <h3 className="font-body text-2xl font-medium leading-5.25 text-black">
          {title}
        </h3>
        <p className="font-body text-sm leading-5 text-muted">
          {body}
        </p>
      </div>
    </article>
  );
}

export default function FasilitasKlinik() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface font-body text-heading">
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
                    item.label === "Fasilitas"
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
              className={`${gradientBg} inline-flex w-[179px] items-center justify-center rounded-full px-7 py-4 font-body text-lg font-semibold text-white shadow-cta`}
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
              Daftar Fasilitas
            </h1>
            <Segmented active="klinik" />
          </div>
          <p className="max-w-[721px] font-body text-base leading-6 text-muted opacity-80">
            Klinik kami menyediakan berbagai fasilitas kesehatan lengkap
          </p>
        </div>

        <section className="flex flex-col gap-6">
          <h2 className="font-body text-2xl font-medium leading-5.25 text-black">
            Fasilitas Umum
          </h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {generalFacilities.map((item) => (
              <FacilityCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-body text-2xl font-medium leading-5.25 text-black">
            Fasilitas Lainnya
          </h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {otherFacilities.map((item) => (
              <FacilityCard key={item.title} {...item} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
