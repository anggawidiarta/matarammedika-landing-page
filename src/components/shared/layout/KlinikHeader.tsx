import { useEffect, useRef } from "react";
import {
  navKlinik,
  navLinkClass,
  navLinkMobileClass,
  type NavKlinikLabel,
} from "@/components/shared/data/navKlinik";
import { gradientBg } from "@/components/shared/data/constants";
import Logo from "@/components/shared/ui/Logo";
import { Menu, X } from "lucide-react";

const ctaClass = `${gradientBg} min-h-11 items-center justify-center rounded-full px-7 py-3.5 font-body text-base font-semibold text-white shadow-cta transition-transform duration-200 ease-out active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue motion-reduce:active:scale-100 lg:text-lg`;

export default function KlinikHeader({
  activeLabel,
  headerTone = "surface",
}: {
  activeLabel: NavKlinikLabel;
  headerTone?: "tint" | "surface";
}) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const headerBg = headerTone === "tint" ? "bg-surface-tint" : "bg-surface";

  useEffect(() => {
    menuRef.current?.removeAttribute("open");
  }, [activeLabel, headerTone]);

  return (
    <header className={`sticky top-0 z-50 ${headerBg}`}>
      <div className="relative mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-4 lg:px-10 xl:px-14">
        <a
          href="/"
          aria-label="Beranda"
          className="relative z-10 rounded-md shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          <Logo />
        </a>

        <nav
          className="hidden flex-1 gap-5 justify-center items-center min-w-0 text-sm lg:flex xl:gap-8 xl:text-base"
          aria-label="Navigasi utama"
        >
          {navKlinik.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`whitespace-nowrap ${navLinkClass(item.label, activeLabel)}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="/#kontak" className={`hidden relative z-10 shrink-0 lg:inline-flex ${ctaClass}`}>
          Informasi
        </a>

        <details ref={menuRef} className="relative z-10 klinik-nav-menu lg:hidden">
          <summary
            className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full text-heading transition-colors duration-200 ease-out hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue [&::-webkit-details-marker]:hidden"
            aria-label="Buka menu"
          >
            <Menu size={22} strokeWidth={1.75} className="klinik-nav-menu-icon-open" aria-hidden />
            <X
              size={22}
              strokeWidth={1.75}
              className="hidden klinik-nav-menu-icon-close"
              aria-hidden
            />
          </summary>

          <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(calc(100vw-2rem),20rem)] origin-top-right rounded-3xl bg-white p-3 shadow-nav">
            <nav className="flex flex-col gap-1" aria-label="Navigasi mobile">
              {navKlinik.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={navLinkMobileClass(item.label, activeLabel)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a href="/#kontak" className={`inline-flex mt-3 w-full ${ctaClass}`}>
              Informasi
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
