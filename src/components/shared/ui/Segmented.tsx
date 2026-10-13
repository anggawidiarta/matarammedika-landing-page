import { gradientBg } from "@/components/shared/data/constants";

export default function Segmented({ active }: { active: "klinik" | "apotek" }) {
  const item = "flex h-8 w-20 items-center justify-center font-body text-base leading-6";
  return (
    <div className="flex h-8 shrink-0">
      <span
        className={`${item} rounded-l-[14px] ${
          active === "klinik" ? `${gradientBg} text-white` : "border border-muted text-muted"
        }`}
      >
        Klinik
      </span>
      <span
        className={`${item} rounded-r-[14px] ${
          active === "apotek"
            ? `${gradientBg} text-white`
            : "border border-muted border-l-0 text-muted"
        }`}
      >
        Apotek
      </span>
    </div>
  );
}
