import PromoCard from "./PromoCard";
import { promoKlinikItems } from "./promoData";
import SiteFooter from "./SiteFooter";
import { Logo, Segmented, gradientBg } from "./ui";

const nav = [
  { label: "Beranda", href: "/" },
  { label: "Dokter", href: "/#dokter" },
  { label: "Layanan", href: "/layanan-klinik" },
  { label: "Fasilitas", href: "/fasilitas-klinik" },
  { label: "Promo", href: "/promo-klinik" },
  { label: "Profil", href: "/profil-klinik" },
];

export default function PromoKlinik() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface font-body text-heading">
      <header className="bg-surface">
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
                    item.label === "Promo"
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-body text-[32px] font-semibold text-heading">
              Informasi Promo
            </h1>
            <Segmented active="klinik" />
          </div>
          <p className="max-w-[721px] font-body text-base leading-6 text-muted opacity-80">
            Kami menyediakan berbagai promo , Seperti
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {promoKlinikItems.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
