import {
  iconCircleBlue,
  iconCircleGreen,
  iconCircleLilac,
  iconCirclePink,
  iconEar,
  iconGigi,
  iconNurse,
  iconParu,
  iconPenyakitDalam,
  iconPregnantLayanan,
  iconServiceAnak,
  iconServiceJiwa,
  iconServiceSaraf,
  iconSkin,
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

const specialists = [
  {
    title: "Spesialis Anak",
    body: "Perawatan bayi, balita, dan anak, termasuk pemeriksaan rutin, penanganan penyakit umum, pemantauan tumbuh kembang, dan imunisasi.",
    icon: <img src={iconServiceAnak} alt="" width={80} height={80} />,
  },
  {
    title: "Spesialis Kandungan",
    body: "Layanan pemeriksaan kehamilan, kesehatan reproduksi wanita, deteksi dini gangguan kehamilan, USG, serta konsultasi terkait kehamilan dan fertilitas.",
    icon: (
      <CircleIcon
        circle={iconCircleGreen}
        glyph={iconPregnantLayanan}
        glyphWidth={34.3992}
        glyphHeight={32.8749}
      />
    ),
  },
  {
    title: "Spesialis Kulit & Kelamin",
    body: "Menangani masalah kulit, alergi, infeksi menular, serta konsultasi estetika dasar.",
    icon: (
      <CircleIcon
        circle={iconCirclePink}
        glyph={iconSkin}
        glyphWidth={39.8521}
        glyphHeight={37.641}
      />
    ),
  },
  {
    title: "Spesialis THT",
    body: "Pelayanan khusus untuk menangani gangguan telinga, hidung, dan tenggorokan, termasuk infeksi, alergi, gangguan pendengaran, sinusitis.",
    icon: (
      <CircleIcon
        circle={iconCircleLilac}
        glyph={iconEar}
        glyphWidth={25.7167}
        glyphHeight={35.9667}
      />
    ),
  },
  {
    title: "Spesialis Saraf",
    body: "pemeriksaan dan penanganan gangguan sistem saraf, seperti sakit kepala kronis, stroke, kejang, neuropati, gangguan gerak.",
    icon: <img src={iconServiceSaraf} alt="" width={80} height={80} />,
  },
  {
    title: "Spesialis Kejiwaan",
    body: "Menangani masalah kesehatan mental seperti kecemasan, depresi, stres berat, gangguan tidur, trauma, serta penilaian kondisi psikologis.",
    icon: <img src={iconServiceJiwa} alt="" width={80} height={80} />,
  },
  {
    title: "Spesialis Penyakit Dalam",
    body: "Menangani berbagai gangguan kesehatan pada organ dalam seperti diabetes, hipertensi, maag kronis, infeksi, gangguan metabolik, serta penyakit kronis lainnya pada dewasa.",
    icon: <img src={iconPenyakitDalam} alt="" width={80} height={80} />,
  },
  {
    title: "Spesialis Paru-Paru",
    body: "Layanan pemeriksaan dan penanganan gangguan pernapasan seperti asma, pneumonia, TBC, infeksi saluran napas, PPOK, serta masalah kesehatan paru lainnya.",
    icon: <img src={iconParu} alt="" width={80} height={80} />,
  },
];

export default function LayananKlinik() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-surface font-body text-heading">
      <header className="bg-surface">
        <div className="flex justify-center px-4 py-4 mx-auto max-w-360 lg:px-10">
          <div className="flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 rounded-[40px] bg-white px-6 py-4 shadow-nav lg:px-10">
            <a href="/" aria-label="Beranda">
              <Logo />
            </a>
            <nav className="flex flex-wrap gap-6 justify-center items-center text-base lg:gap-10">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={
                    item.label === "Layanan"
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
              Daftar Layanan
            </h1>
            <Segmented active="klinik" />
          </div>
          <p className="max-w-[721px] font-body text-base leading-6 text-muted opacity-80">
            Klinik kami menyediakan berbagai layanan kesehatan lengkap yang
            ditangani oleh tenaga medis profesional, memberikan perawatan
            terbaik bagi setiap pasien.
          </p>
        </div>

        <section className="flex flex-col gap-6">
          <h2 className="font-body text-2xl font-medium leading-[21px] text-black">
            Konsultasi Dokter
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="flex gap-6 items-start px-8 py-5 bg-white rounded-3xl shadow-card">
              <CircleIcon
                circle={iconCircleBlue}
                glyph={iconNurse}
                glyphWidth={30.75}
                glyphHeight={30.75}
              />
              <div className="flex flex-col gap-3">
                <h3 className="font-body text-2xl font-medium leading-5.25 text-black">
                  Umum
                </h3>
                <p className="text-sm leading-5 font-body text-muted">
                  Menangani keluhan gigi dan mulut seperti pencabutan,
                  penambalan, pembersihan karang gigi, dan konsultasi kesehatan
                  gigi.
                </p>
              </div>
            </article>
            <article className="flex gap-6 items-start px-8 py-5 bg-white rounded-3xl shadow-card">
              <img src={iconGigi} alt="" width={80} height={80} />
              <div className="flex flex-col gap-3">
                <h3 className="font-body text-2xl font-medium leading-[21px] text-black">
                  Gigi
                </h3>
                <p className="text-sm leading-5 font-body text-muted">
                  Pelayanan pemeriksaan kesehatan dasar, konsultasi keluhan
                  umum, dan tindakan medis ringan.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-body text-2xl font-medium leading-5.25 text-black">
            Konsultasi Dokter Spesialis
          </h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {specialists.map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-6 px-8 py-5 bg-white rounded-3xl shadow-card"
              >
                {item.icon}
                <div className="flex flex-col gap-3">
                  <h3 className="font-body text-2xl font-medium leading-5.25 text-black">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-5 font-body text-muted">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
