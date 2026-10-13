import { useEffect, useMemo, useState } from "react";
import IconFeatureCard from "@/components/shared/cards/IconFeatureCard";
import {
  fasilitasLainnya,
  fasilitasUmum,
  type FasilitasItem,
} from "@/components/fasilitas/fasilitasData";
import KlinikPageShell from "@/components/shared/layout/KlinikPageShell";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";
import { renderIcon } from "@/components/shared/ui";
import { fetchPublicFeatures } from "@/lib/cms/fetchPublicFeatures";
import { toIconDescriptor } from "@/lib/cms/mapFeatureItem";
import type { CmsPublicItem } from "@/lib/cms/types";

function FeatureSection({ title, items }: { title: string; items: FasilitasItem[] }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-medium leading-snug text-black font-body text-balance sm:text-2xl">
        {title}
      </h2>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <IconFeatureCard
            key={item.title}
            icon={renderIcon(item.icon)}
            title={item.title}
            body={item.body}
          />
        ))}
      </div>
    </section>
  );
}

function toFasilitasItem(item: CmsPublicItem): FasilitasItem {
  return {
    title: item.title,
    body: item.body,
    icon: toIconDescriptor(item.icon),
  };
}

export default function FasilitasKlinik() {
  const [items, setItems] = useState<CmsPublicItem[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const data = await fetchPublicFeatures("/api/public/fasilitas");
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

  const umum = useMemo(() => {
    if (!items) return fasilitasUmum;
    const sectionItems = items.filter((item) => item.section === "umum").map(toFasilitasItem);
    return sectionItems.length > 0 ? sectionItems : fasilitasUmum;
  }, [items]);

  const lainnya = useMemo(() => {
    if (!items) return fasilitasLainnya;
    const sectionItems = items.filter((item) => item.section === "lainnya").map(toFasilitasItem);
    return sectionItems.length > 0 ? sectionItems : fasilitasLainnya;
  }, [items]);

  return (
    <KlinikPageShell activeLabel="Fasilitas">
      <main className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 pt-8 pb-24">
        <KlinikPageTitle
          title="Daftar Fasilitas"
          caption="Klinik kami menyediakan berbagai fasilitas kesehatan lengkap"
        />

        {status === "loading" && (
          <p className="text-sm font-body text-muted">Memuat daftar fasilitas...</p>
        )}

        <FeatureSection title="Fasilitas Umum" items={umum} />
        <FeatureSection title="Fasilitas Lainnya" items={lainnya} />
      </main>
    </KlinikPageShell>
  );
}
