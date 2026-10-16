import PromoGrid from "@/components/shared/sections/PromoGrid";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";
import type { PromoCardData } from "@/lib/cms/promoDisplay";

export default function PromoKlinik({ promos }: { promos: PromoCardData[] }) {
  const active = promos.filter((promo) => promo.status !== "ended");
  const ended = promos.filter((promo) => promo.status === "ended");

  return (
    <main className="page-container flex flex-col gap-10 pt-8 pb-24">
      <div className="bg-surface-highlight relative overflow-hidden rounded-[24px] px-6 py-8 sm:px-10 sm:py-10">
        <div
          className="bg-gradient-blue-green pointer-events-none absolute -top-16 -right-16 size-64 rounded-full opacity-15 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-5">
          {active.length > 0 ? (
            <p className="font-accent text-promo shadow-float inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold">
              <span className="relative flex size-2" aria-hidden>
                <span className="bg-promo absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping" />
                <span className="bg-promo relative inline-flex size-2 rounded-full" />
              </span>
              {active.length} promo aktif sekarang
            </p>
          ) : null}
          <KlinikPageTitle
            align="start"
            title="Promo Spesial Klinik"
            caption="Layanan kesehatan berkualitas dengan harga lebih hemat. Klaim sebelum waktunya habis, periode promo terbatas."
          />
        </div>
      </div>

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
