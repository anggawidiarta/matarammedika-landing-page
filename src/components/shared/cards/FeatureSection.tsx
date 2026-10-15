import IconFeatureCard from "@/components/shared/cards/IconFeatureCard";
import { renderIcon } from "@/components/shared/ui/iconDescriptor";
import type { FeatureItem } from "@/types/feature";

export default function FeatureSection({
  title,
  items,
  layout = "stack",
  gridClassName = "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
}: {
  title: string;
  items: FeatureItem[];
  layout?: "stack" | "inline";
  gridClassName?: string;
}) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-body text-xl font-medium leading-snug text-balance text-black sm:text-2xl">
        {title}
      </h2>
      <div className={gridClassName}>
        {items.map((item) => (
          <IconFeatureCard
            key={item.title}
            layout={layout}
            icon={renderIcon(item.icon)}
            title={item.title}
            body={item.body}
          />
        ))}
      </div>
    </section>
  );
}
