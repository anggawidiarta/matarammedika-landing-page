import logoMarkLight from "@/assets/logos/mark-light.svg";
import logoWordmarkLight from "@/assets/logos/wordmark-light.svg";

export default function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  // Header uses stable public URLs so the browser cache survives page swaps.
  const mark = variant === "light" ? logoMarkLight.src : "/logo.svg";
  const word = variant === "light" ? logoWordmarkLight.src : "/wordmark.svg";
  const markSize = variant === "light" ? 49 : 56;
  const wordWidth = variant === "light" ? 144 : 164;
  const wordHeight = variant === "light" ? 31 : 35;

  return (
    <span className="inline-flex gap-3 items-center">
      <img
        src={mark}
        alt=""
        width={markSize}
        height={markSize}
        decoding="async"
        fetchPriority={variant === "dark" ? "high" : "auto"}
        draggable={false}
      />
      <img
        src={word}
        alt="Apotek & Klinik Mataram Medika"
        width={wordWidth}
        height={wordHeight}
        decoding="async"
        fetchPriority={variant === "dark" ? "high" : "auto"}
        draggable={false}
      />
    </span>
  );
}
