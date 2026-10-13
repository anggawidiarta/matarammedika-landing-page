import { useEffect, useMemo, useState } from "react";
import IconFeatureCard from "@/components/shared/cards/IconFeatureCard";
import {
  layananSpecialists,
  layananUmumGigi,
  type LayananItem,
} from "@/components/layanan/layananData";
import KlinikPageShell from "@/components/shared/layout/KlinikPageShell";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";
import { renderIcon } from "@/components/shared/ui";
import { fetchPublicFeatures } from "@/lib/cms/fetchPublicFeatures";
import { toIconDescriptor } from "@/lib/cms/mapFeatureItem";
import type { CmsPublicItem } from "@/lib/cms/types";

function toLayananItem(item: CmsPublicItem): LayananItem {
  return {
    title: item.title,
    body: item.body,
    icon: toIconDescriptor(item.icon),
  };
}

const FALLBACK_UMUM_GIGI = [layananUmumGigi.umum, layananUmumGigi.gigi];
const FALLBACK_SPECIALISTS = layananSpecialists;

export default function LayananKlinik() {
  const [items, setItems] = useState<CmsPublicItem[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const data = await fetchPublicFeatures("/api/public/layanan");
        if (cancelled) return;
        if (data.length === 0) {
          setItems(null);
          setStatus("fallback");
          return;
        }
        setItems(data);
        setStatus("ready");
      } catch {
        if (cancelled) return;
        setItems(null);
        setStatus("fallback");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const umumGigi = useMemo(() => {
    if (!items) return FALLBACK_UMUM_GIGI;
    const sectionItems = items.filter((item) => item.section === "umum_gigi").map(toLayananItem);
    return sectionItems.length > 0 ? sectionItems : FALLBACK_UMUM_GIGI;
  }, [items]);

  const specialists = useMemo(() => {
    if (!items) return FALLBACK_SPECIALISTS;
    const sectionItems = items.filter((item) => item.section === "spesialis").map(toLayananItem);
    return sectionItems.length > 0 ? sectionItems : FALLBACK_SPECIALISTS;
  }, [items]);

  return (
    <KlinikPageShell activeLabel="Layanan">
      <main className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 pt-8 pb-24">
        <KlinikPageTitle
          title="Daftar Layanan"
          caption="Klinik kami menyediakan berbagai layanan kesehatan lengkap yang ditangani oleh tenaga medis profesional, memberikan perawatan terbaik bagi setiap pasien."
        />

        {status === "loading" && (
          <p className="font-body text-sm text-muted">Memuat daftar layanan...</p>
        )}

        <section className="flex flex-col gap-6">
          <h2 className="font-body text-xl font-medium leading-snug text-balance text-black sm:text-2xl">
            Konsultasi Dokter
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {umumGigi.map((item) => (
              <IconFeatureCard
                key={item.title}
                layout="inline"
                icon={renderIcon(item.icon)}
                title={item.title}
                body={item.body}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-body text-xl font-medium leading-snug text-balance text-black sm:text-2xl">
            Konsultasi Dokter Spesialis
          </h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {specialists.map((item) => (
              <IconFeatureCard
                key={item.title}
                icon={renderIcon(item.icon)}
                title={item.title}
                body={item.body}
              />
            ))}
          </div>
        </section>
      </main>
    </KlinikPageShell>
  );
}
