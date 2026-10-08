import { clinicDoctors } from "./doctorData";
import SiteFooter from "./SiteFooter";
import { Logo, gradientBg } from "./ui";

const nav = [
  { label: "Beranda", href: "/" },
  { label: "Dokter", href: "/dokter-klinik" },
  { label: "Layanan", href: "/layanan-klinik" },
  { label: "Fasilitas", href: "/fasilitas-klinik" },
  { label: "Promo", href: "/promo-klinik" },
  { label: "Profil", href: "/profil-klinik" },
];

export default function DokterKlinik() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface font-body text-heading">
      <header className="bg-surface-tint">
        <div className="mx-auto flex max-w-[1440px] justify-center px-4 py-4 lg:px-10">
          <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 rounded-[40px] bg-white px-6 py-4 shadow-nav lg:px-10">
            <a href="/" aria-label="Beranda">
              <Logo />
            </a>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-base lg:gap-10">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={
                    item.label === "Dokter"
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

      <main className="bg-surface-tint pb-24">
        <div className="mx-auto flex max-w-[1230px] flex-col items-center gap-12 px-6 pt-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="font-body text-[32px] font-semibold text-heading opacity-80">
              Informasi Dokter
            </h1>
            <p className="max-w-[676px] font-body text-sm leading-5 text-muted opacity-80">
              Tenaga medis profesional yang berdedikasi memberikan pelayanan
              terbaik
            </p>
          </div>

          <ul className="grid w-full list-none grid-cols-1 justify-items-center gap-x-8 gap-y-10 p-0 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-16">
            {clinicDoctors.map((doctor) => (
              <li key={doctor.name} className="w-full max-w-[324px]">
                <img
                  src={doctor.card}
                  alt={`${doctor.name}, ${doctor.specialty}`}
                  width={324}
                  height={456}
                  className="h-auto w-full max-w-none"
                />
              </li>
            ))}
          </ul>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
