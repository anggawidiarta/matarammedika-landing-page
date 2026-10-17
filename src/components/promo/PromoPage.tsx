import PromoGrid from "@/components/shared/sections/PromoGrid";
import type { PromoCardData } from "@/lib/cms/promoDisplay";

export default function PromoKlinik({ promos }: { promos: PromoCardData[] }) {
  const active = promos.filter((promo) => promo.status !== "ended");
  const ended = promos.filter((promo) => promo.status === "ended");

  return (
    <main className="page-container flex flex-col gap-8 pt-6 pb-16">
      <header className="bg-surface-highlight relative overflow-hidden rounded-[24px] px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <div
          className="bg-gradient-blue-green pointer-events-none absolute -top-20 -right-20 size-72 rounded-full opacity-15 blur-3xl"
          aria-hidden
        />
        <div
          className="bg-gradient-promo pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full opacity-10 blur-3xl"
          aria-hidden
        />
        <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            {active.length > 0 ? (
              <p className="font-accent text-promo shadow-float inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold lg:hidden">
                <span className="relative flex size-2" aria-hidden>
                  <span className="bg-promo absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping" />
                  <span className="bg-promo relative inline-flex size-2 rounded-full" />
                </span>
                {active.length} promo aktif sekarang
              </p>
            ) : null}
            <h1 className="font-body text-heading min-w-0 text-[30px] leading-[1.1] font-semibold text-balance [overflow-wrap:anywhere] sm:text-4xl lg:text-5xl">
              Promo{" "}
              <span className="bg-gradient-blue-green-text bg-clip-text text-transparent">
                Spesial
              </span>
            </h1>
            <p className="font-body text-muted max-w-[560px] text-sm leading-6 text-pretty sm:text-base">
              Layanan kesehatan berkualitas dengan harga lebih hemat. Klaim sebelum waktunya habis,
              periode promo terbatas.
            </p>
          </div>
          {active.length > 0 ? (
            <div className="shadow-float hidden min-w-[200px] flex-col items-center gap-1 rounded-[20px] bg-white px-8 py-5 lg:flex">
              <span className="font-accent text-promo flex items-center gap-2 text-sm font-semibold">
                <span className="relative flex size-2" aria-hidden>
                  <span className="bg-promo absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping" />
                  <span className="bg-promo relative inline-flex size-2 rounded-full" />
                </span>
                Aktif sekarang
              </span>
              <span className="font-accent text-heading text-6xl leading-none font-bold tabular-nums">
                {active.length}
              </span>
              <span className="font-body text-muted text-sm">promo tersedia</span>
            </div>
          ) : null}
        </div>
      </header>

      {promos.length === 0 ? (
        <p className="font-body text-muted py-16 text-center text-lg">
          Belum ada promo saat ini. Pantau terus halaman ini untuk promo terbaru kami.
        </p>
      ) : null}

      {active.length > 0 ? <PromoGrid promos={active} /> : null}

      {ended.length > 0 ? (
        <section className="flex flex-col gap-6" aria-labelledby="promo-ended-heading">
          <h2 id="promo-ended-heading" className="font-body text-heading text-xl font-semibold">
            Promo Sebelumnya
          </h2>
          <PromoGrid promos={ended} />
        </section>
      ) : null}
    </main>
  );
}
