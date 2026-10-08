import {
  badgeGlow,
  bannerFamily,
  bannerTexture,
  doctor,
  doctorMask,
  heroCircle,
  heroOutline,
  heroShape,
  iconCircleBlue,
  iconCircleGreen,
  iconCircleLilac,
  iconCirclePink,
  iconEar,
  iconFacilityAdmin,
  iconFacilityDoctor,
  iconFacilityNurse,
  iconFacilityWait,
  iconPregnant,
  iconServiceAnak,
  iconServiceJiwa,
  iconServiceSaraf,
  iconSkin,
  iconToilet,
  iconUserSearch,
  iconWhatsappPink,
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
} from "./assets";
import PromoCard from "./PromoCard";
import { promoKlinikPreview } from "./promoData";
import SiteFooter from "./SiteFooter";
import {
  ArrowIcon,
  GradientLink,
  Logo,
  Segmented,
  Stethoscope,
  gradientBg,
} from "./ui";

const WA_KLINIK = "https://wa.me/6287878847788";

const insurersRowOne = [
  { src: insurerOwlexa, width: 146, height: 45 },
  { src: insurerBcaLife, width: 142, height: 80 },
  { src: insurerMandiriInhealth, width: 158, height: 58 },
  { src: insurerPln, width: 114, height: 80 },
  { src: insurerBniLife, width: 152, height: 78 },
];

const insurersRowTwo = [
  { src: insurerBni, width: 114, height: 46 },
  { src: insurerAdmedika, width: 167, height: 33 },
  { src: insurerTelkomedika, width: 129, height: 64 },
  { src: insurerBriLife, width: 172, height: 66 },
  { src: insurerBri, width: 152, height: 42 },
  { src: insurerYkkbi, width: 122, height: 66 },
];

const services = [
  {
    title: "Spesialis Anak",
    body: "Perawatan bayi, balita, dan anak, termasuk pemeriksaan rutin, penanganan penyakit umum, pemantauan tumbuh kembang, dan imunisasi.",
    icon: <img src={iconServiceAnak} alt="" width={80} height={80} />,
  },
  {
    title: "Spesialis Kandungan",
    body: "Layanan pemeriksaan kehamilan, kesehatan reproduksi wanita, deteksi dini gangguan kehamilan, USG, serta konsultasi terkait kehamilan dan fertilitas.",
    icon: (
      <span className="relative inline-block size-20">
        <img src={iconCircleGreen} alt="" width={80} height={80} />
        <img
          src={iconPregnant}
          alt=""
          width={34.3992}
          height={32.8749}
          className="absolute left-5 top-[19px]"
        />
      </span>
    ),
  },
  {
    title: "Spesialis Kulit & Kelamin",
    body: "Menangani masalah kulit, alergi, infeksi menular, serta konsultasi estetika dasar.",
    icon: (
      <span className="relative inline-block size-20">
        <img src={iconCirclePink} alt="" width={80} height={80} />
        <img
          src={iconSkin}
          alt=""
          width={39.8521}
          height={37.641}
          className="absolute left-5 top-[19px]"
        />
      </span>
    ),
  },
  {
    title: "Spesialis THT",
    body: "Pelayanan khusus untuk menangani gangguan telinga, hidung, dan tenggorokan, termasuk infeksi, alergi, gangguan pendengaran, sinusitis.",
    icon: (
      <span className="relative inline-block size-20">
        <img src={iconCircleLilac} alt="" width={80} height={80} />
        <img
          src={iconEar}
          alt=""
          width={25.7167}
          height={35.9667}
          className="absolute left-[27px] top-[22px]"
        />
      </span>
    ),
  },
  {
    title: "Spesialis Saraf",
    body: "pemeriksaan dan penanganan gangguan sistem saraf, seperti sakit kepala kronis, stroke, kejang, neuropati, gangguan gerak.",
    icon: <img src={iconServiceSaraf} alt="" width={80} height={80} />,
  },
  {
    title: "Spesialis Kejiwaaan",
    body: "Menangani masalah kesehatan mental seperti kecemasan, depresi, stres berat, gangguan tidur, trauma, serta penilaian kondisi psikologis.",
    icon: <img src={iconServiceJiwa} alt="" width={80} height={80} />,
  },
];

const facilities = [
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
    title: "Praktik Dokter",
    body: "Tempat dokter melakukan pemeriksaan dan konsultasi.",
    icon: <img src={iconFacilityDoctor} alt="" width={80} height={80} />,
  },
  {
    title: "Toilet",
    body: "Toilet bersih dengan fasilitas kebersihan lengkap.",
    icon: (
      <span className="relative inline-block size-20">
        <img src={iconCircleBlue} alt="" width={80} height={80} />
        <img
          src={iconToilet}
          alt=""
          width={33.75}
          height={37.1667}
          className="absolute left-[23px] top-[21px]"
        />
      </span>
    ),
  },
];

function SectionIntro({
  title,
  caption,
  active = "klinik",
}: {
  title: string;
  caption: string;
  active?: "klinik" | "apotek";
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <h2 className="font-body text-[32px] font-semibold text-heading">
          {title}
        </h2>
        <Segmented active={active} />
      </div>
      <p className="max-w-[721px] font-body text-base leading-6 text-muted opacity-80">
        {caption}
      </p>
    </div>
  );
}

export default function LandingPageKlinik() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface font-body text-heading">
      <header className="bg-surface-tint">
        <div className="mx-auto flex max-w-[1440px] justify-center px-4 py-4 lg:px-10">
          <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 rounded-[40px] bg-white px-6 py-4 shadow-nav lg:px-10">
            <a href="#beranda" aria-label="Beranda">
              <Logo />
            </a>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-base lg:gap-10">
              <a href="#beranda" className="font-bold text-brand">
                Beranda
              </a>
              {["Dokter", "Layanan", "Fasilitas", "Promo", "Profil"].map(
                (item) => (
                  <a
                    key={item}
                    href={
                      item === "Profil"
                        ? "/profil-klinik"
                        : item === "Promo"
                          ? "/promo-klinik"
                          : `#${item.toLowerCase()}`
                    }
                    className="text-muted opacity-80"
                  >
                    {item}
                  </a>
                ),
              )}
            </nav>
            <a
              href="#kontak"
              className={`${gradientBg} inline-flex w-[179px] items-center justify-center rounded-full px-7 py-4 font-body text-lg font-semibold text-white shadow-cta`}
            >
              Informasi
            </a>
          </div>
        </div>
      </header>

      <section id="beranda" className="bg-surface-tint">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-12 lg:grid-cols-[minmax(0,688px)_413px] lg:justify-center lg:gap-24 lg:px-[106px] lg:pb-24 lg:pt-10">
          <div>
            <Segmented active="apotek" />
            <h1 className="mt-[72px] max-w-[688px] bg-gradient-brand-text bg-clip-text font-body text-[40px] font-bold leading-normal text-transparent">
              Apotek Mataram Medika
            </h1>
            <p className="mt-4 max-w-[655px] font-body text-base leading-6 text-muted">
              hadir dengan slogan “Terlengkap & Termurah”, dengan tujuan dan
              harapan menjadi apotek yang menyediakan berbagai jenis obat secara
              lengkap dengan harga yang terjangkau, guna memenuhi kebutuhan
              kesehatan masyarakat. ringkas ini
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
                  className="absolute -left-[19px] -top-[15px]"
                />
                <span className="absolute left-1 top-[3px]">
                  <Stethoscope />
                </span>
              </span>
              <span>
                <span className="block font-body text-base font-semibold text-heading">
                  dr. Kristopher May Pamudji
                </span>
                <span className="block font-body text-xs text-muted">
                  Spesialis Anak
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto flex max-w-[1228px] flex-col items-center gap-10 px-6">
          <SectionIntro
            title="Kerjasama Asuransi"
            caption="Kami telah bekerjasama dengan beberapa pihak asuransi, seperti"
          />
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-[68px]">
              {insurersRowOne.map((logo) => (
                <img
                  key={logo.src}
                  src={logo.src}
                  alt=""
                  width={logo.width}
                  height={logo.height}
                  className="object-contain"
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-[68px]">
              {insurersRowTwo.map((logo) => (
                <img
                  key={logo.src}
                  src={logo.src}
                  alt=""
                  width={logo.width}
                  height={logo.height}
                  className="object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="layanan" className="bg-surface-tint py-20">
        <div className="mx-auto flex max-w-[1228px] flex-col gap-10 px-6">
          <SectionIntro
            title="Daftar Layanan"
            caption="Klinik kami menyediakan berbagai layanan kesehatan lengkap yang ditangani oleh tenaga medis profesional, memberikan perawatan terbaik bagi setiap pasien."
          />
          <div>
            <h3 className="font-body text-2xl font-medium leading-10 text-heading">
              Layanan Klinik
            </h3>
            <p className="font-body text-sm leading-5 text-muted">
              Solusi kesehatan terpadu untuk keluarga Anda.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="flex flex-col gap-6 rounded-3xl bg-white px-8 py-5 shadow-card"
              >
                {service.icon}
                <div className="flex flex-col gap-3">
                  <h4 className="font-body text-2xl font-medium leading-[21px] text-black">
                    {service.title}
                  </h4>
                  <p className="font-body text-sm leading-5 text-muted">
                    {service.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-brand-strong bg-surface-highlight px-8 py-5 shadow-card lg:h-[124px] lg:flex-row lg:items-center">
            <div className="flex items-center gap-6">
              <span className="relative inline-block size-20 shrink-0">
                <img src={iconCircleBlue} alt="" width={80} height={80} />
                <img
                  src={iconUserSearch}
                  alt=""
                  width={40}
                  height={40}
                  className="absolute left-5 top-5"
                />
              </span>
              <div>
                <p className="font-body text-2xl font-medium leading-[21px] text-black">
                  Belum menemukan layanan yang dicari?
                </p>
                <p className="mt-3 font-accent text-sm leading-5 text-muted">
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

      <section id="fasilitas" className="bg-surface py-20">
        <div className="mx-auto flex max-w-[1228px] flex-col gap-10 px-6">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-body text-[32px] font-semibold text-heading">
                  Daftar Fasilitas
                </h2>
                <Segmented active="klinik" />
              </div>
              <p className="mt-3 max-w-[721px] font-body text-base leading-6 text-muted opacity-80">
                Klinik kami menyediakan berbagai fasilitas kesehatan lengkap
              </p>
            </div>
            <GradientLink href="/fasilitas-klinik">
              Lihat Selengkapnya
              <ArrowIcon />
            </GradientLink>
          </div>
          <h3 className="font-body text-2xl font-medium leading-[21px]">
            Fasilitas Klinik
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {facilities.map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-6 rounded-3xl bg-white px-8 py-5 shadow-card"
              >
                {item.icon}
                <div className="flex flex-col gap-3">
                  <h4 className="font-body text-xl font-medium leading-[21px] text-black">
                    {item.title}
                  </h4>
                  <p className="font-body text-xs leading-5 text-muted">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="promo" className="bg-surface-tint py-20">
        <div className="mx-auto flex max-w-[1228px] flex-col gap-10 px-6">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-body text-[32px] font-semibold text-heading">
                  Informasi Promo
                </h2>
                <Segmented active="klinik" />
              </div>
              <p className="mt-3 font-body text-base leading-6 text-muted opacity-80">
                Kami menyediakan berbagai promo , Seperti
              </p>
            </div>
            <GradientLink href="/promo-klinik">
              Lihat Selengkapnya
              <ArrowIcon />
            </GradientLink>
          </div>
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
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-4 font-accent text-lg font-semibold text-promo-cta"
              >
                <img src={iconWhatsappPink} alt="" width={24} height={24} />
                Klaim Promo
              </a>
            </div>
            <img
              src={bannerFamily}
              alt="Imunisasi anak di klinik"
              width={576}
              height={329}
              className="relative z-10 h-[260px] w-full object-cover lg:ml-auto lg:h-82.25 lg:w-xl"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
