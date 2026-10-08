import {
  navKlinik,
  navKlinikHref,
  navLinkClass,
  type NavKlinikLabel,
} from "@/components/klinik/data/navKlinik";
import { Logo, gradientBg } from "@/components/klinik/ui";

type NavVariant = "home" | "page";

export default function KlinikHeader({
  activeLabel,
  navVariant = "page",
  headerTone = "surface",
}: {
  activeLabel: NavKlinikLabel;
  navVariant?: NavVariant;
  headerTone?: "tint" | "surface";
}) {
  const headerBg = headerTone === "tint" ? "bg-surface-tint" : "bg-surface";
  const logoHref = navVariant === "home" ? "#beranda" : "/";
  const infoHref = navVariant === "home" ? "#kontak" : "/#kontak";

  return (
    <header className={headerBg}>
      <div className="mx-auto flex max-w-[1440px] justify-center px-4 py-4 lg:px-10">
        <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 rounded-[40px] bg-white px-6 py-4 shadow-nav lg:px-10">
          <a href={logoHref} aria-label="Beranda">
            <Logo />
          </a>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-base lg:gap-10">
            {navKlinik.map((item) => (
              <a
                key={item.label}
                href={navKlinikHref(item, navVariant)}
                className={navLinkClass(item.label, activeLabel)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={infoHref}
            className={`${gradientBg} inline-flex w-[179px] items-center justify-center rounded-full px-7 py-4 font-body text-lg font-semibold text-white shadow-cta`}
          >
            Informasi
          </a>
        </div>
      </div>
    </header>
  );
}
