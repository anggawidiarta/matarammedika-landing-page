import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { MODULE_ICONS } from "@/components/kelola/moduleIcons";
import Button, { buttonClass } from "@/components/kelola/ui/Button";
import { MODULE_SITE_PATHS, type CmsModule } from "@/lib/kelola/constants";

type ManagerHeaderProps = {
  module: CmsModule;
  heading: string;
  intro: string;
  noun: string;
  total: number;
  published: number;
  loadError: boolean;
  loading: boolean;
  onRetry: () => void;
  children?: ReactNode;
};

export default function ManagerHeader({
  module,
  heading,
  intro,
  noun,
  total,
  published,
  loadError,
  loading,
  onRetry,
  children,
}: ManagerHeaderProps) {
  const Icon = MODULE_ICONS[module];

  return (
    <>
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="flex min-w-0 items-start gap-4">
            <span
              aria-hidden
              className="bg-surface-highlight text-blue inline-flex size-12 shrink-0 items-center justify-center rounded-xl"
            >
              <Icon size={24} strokeWidth={1.75} />
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="text-[28px] leading-snug font-semibold text-balance sm:text-[32px]">
                {heading}
              </h1>
              <p className="text-heading/80 max-w-prose text-sm leading-6 text-pretty sm:text-base">
                {intro}
              </p>
              <p className="text-heading/80 mt-1 flex items-center gap-2 text-sm tabular-nums">
                <span
                  aria-hidden
                  className={`size-2 rounded-full ${published > 0 ? "bg-green" : "bg-heading/30"}`}
                />
                <span>
                  <span className="text-heading font-semibold">{published}</span> dari {total}{" "}
                  {noun} tampil di situs
                </span>
              </p>
            </div>
          </div>

          <a
            href={MODULE_SITE_PATHS[module]}
            target="_blank"
            rel="noopener"
            className={buttonClass("secondary", "shrink-0 px-4 text-sm")}
          >
            Lihat di situs
            <ArrowUpRight size={18} aria-hidden />
            <span className="sr-only">(tab baru)</span>
          </a>
        </div>
        {children}
      </header>

      {loadError && (
        <div
          role="alert"
          className="bg-promo-red-light/40 flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-2.5"
        >
          <p className="text-sm">Daftar belum berhasil dimuat ulang.</p>
          <Button variant="secondary" onClick={onRetry} loading={loading}>
            Coba lagi
          </Button>
        </div>
      )}
    </>
  );
}
