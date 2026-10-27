import { ArrowUpRight } from "lucide-react";

export type ChipTone = "green" | "gray" | "blue" | "promo" | "red";

const TONES: Record<ChipTone, { chip: string; dot: string }> = {
  green: { chip: "bg-green/15 text-heading", dot: "bg-green" },
  gray: { chip: "bg-heading/8 text-heading/80", dot: "bg-heading/40" },
  blue: { chip: "bg-blue/10 text-heading", dot: "bg-blue" },
  promo: { chip: "bg-promo/10 text-heading", dot: "bg-promo" },
  red: { chip: "bg-danger/10 text-heading", dot: "bg-danger" },
};

type StatusChipProps = {
  tone: ChipTone;
  children: string;
  href?: string;
  title?: string;
};

const CHIP =
  "inline-flex min-h-6 items-center gap-1.5 rounded-md px-2 text-[13px] font-medium whitespace-nowrap";

export default function StatusChip({ tone, children, href, title }: StatusChipProps) {
  const style = TONES[tone];
  const dot = <span aria-hidden className={`size-2 rounded-full ${style.dot}`} />;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        className={`${CHIP} ${style.chip} focus-visible:outline-blue relative transition-opacity duration-200 after:absolute after:-inset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none`}
      >
        {dot}
        {children}
        <ArrowUpRight size={14} aria-hidden />
        <span className="sr-only">(tab baru)</span>
      </a>
    );
  }

  return (
    <span title={title} className={`${CHIP} ${style.chip}`}>
      {dot}
      {children}
    </span>
  );
}
