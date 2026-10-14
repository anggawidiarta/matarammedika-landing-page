import { useState } from "react";
import Segmented, { type SegmentedUnit } from "@/components/shared/ui/Segmented";
import { GradientLink } from "@/components/shared/ui/GradientLink";
import { Pill, Stethoscope } from "lucide-react";

const HERO = {
  klinik: {
    title: "Klinik Mataram Medika",
    body: "Layanan kesehatan terpadu untuk keluarga Anda — dari rawat jalan dan konsultasi spesialis hingga fasilitas nyaman, dengan tenaga medis profesional di Mataram.",
    cta: "Lihat Layanan",
    href: "#layanan",
    Icon: Stethoscope,
  },
  apotek: {
    title: "Apotek Mataram Medika",
    body: "Hadir dengan slogan “Terlengkap & Termurah”, dengan tujuan dan harapan menjadi apotek yang menyediakan berbagai jenis obat secara lengkap dengan harga yang terjangkau, guna memenuhi kebutuhan kesehatan masyarakat.",
    cta: "Lihat Layanan",
    href: "#layanan",
    Icon: Pill,
  },
} as const;

const panelMotion =
  "col-start-1 row-start-1 transition-[opacity,transform,filter] duration-300 ease-out motion-reduce:transition-none";

export default function HomeBerandaHero() {
  const [unit, setUnit] = useState<SegmentedUnit>("klinik");

  return (
    <div>
      <Segmented active={unit} onChange={setUnit} />

      <div className="grid mt-[72px]">
        {(["klinik", "apotek"] as const).map((key) => {
          const copy = HERO[key];
          const visible = unit === key;
          return (
            <div
              key={key}
              className={`${panelMotion} ${
                visible
                  ? "z-10 opacity-100 translate-y-0 blur-0"
                  : "z-0 opacity-0 translate-y-1.5 blur-[4px]"
              }`}
              aria-hidden={!visible}
              inert={!visible ? true : undefined}
            >
              <h1 className="max-w-[688px] bg-gradient-blue-green-text bg-clip-text font-body text-[32px] font-bold leading-snug text-balance text-transparent sm:text-[36px] lg:text-[40px] lg:leading-normal">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-[655px] font-body text-base leading-6 text-pretty text-muted">
                {copy.body}
              </p>
              <div className="mt-8">
                <GradientLink href={copy.href}>
                  <copy.Icon size={24} aria-hidden strokeWidth={2} />
                  {copy.cta}
                </GradientLink>
              </div>
            </div>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {HERO[unit].title}
      </p>
    </div>
  );
}
