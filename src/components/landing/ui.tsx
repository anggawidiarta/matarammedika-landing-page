import type { ReactNode } from "react";
import {
  iconArrow,
  logoMark,
  logoMarkLight,
  logoWordmark,
  logoWordmarkLight,
  steth1,
  steth2,
  steth3,
  steth4,
  steth5,
} from "./assets";

export const gradientBg = "bg-gradient-brand";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const mark = variant === "light" ? logoMarkLight : logoMark;
  const word = variant === "light" ? logoWordmarkLight : logoWordmark;
  const markSize = variant === "light" ? 49 : 56;
  const wordWidth = variant === "light" ? 144 : 164;
  const wordHeight = variant === "light" ? 31 : 35;

  return (
    <span className="inline-flex gap-3 items-center">
      <img src={mark} alt="" width={markSize} height={markSize} />
      <img
        src={word}
        alt="Apotek & Klinik Mataram Medika"
        width={wordWidth}
        height={wordHeight}
      />
    </span>
  );
}

export function Stethoscope() {
  return (
    <span className="inline-block relative size-6 shrink-0">
      <img
        src={steth1}
        alt=""
        width={13.2891}
        height={11.6146}
        className="absolute"
        style={{ left: "20.87%", top: "4.76%" }}
      />
      <img
        src={steth2}
        alt=""
        width={1.59469}
        height={3.82725}
        className="absolute"
        style={{ left: "58.53%", top: 0 }}
      />
      <img
        src={steth3}
        alt=""
        width={1.59469}
        height={3.82725}
        className="absolute"
        style={{ left: "32.28%", top: 0 }}
      />
      <img
        src={steth4}
        alt=""
        width={10.6578}
        height={12.0662}
        className="absolute"
        style={{ left: "18.99%", top: "49.72%" }}
      />
      <img
        src={steth5}
        alt=""
        width={4.9964}
        height={4.99641}
        className="absolute"
        style={{ left: "60.19%", top: "61.46%" }}
      />
    </span>
  );
}

export function Segmented({
  active,
}: {
  active: "klinik" | "apotek";
}) {
  const item = "flex h-8 w-20 items-center justify-center font-body text-base leading-6";
  return (
    <div className="flex h-8 shrink-0">
      <span
        className={`${item} rounded-l-[14px] ${
          active === "klinik"
            ? `${gradientBg} text-white`
            : "border border-muted text-muted"
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

export function GradientLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={`inline-flex gap-2 items-center px-7 py-4 text-lg font-semibold text-white rounded-full ${gradientBg} font-body shadow-cta`}
    >
      {children}
    </a>
  );
}

export function ArrowIcon() {
  return <img src={iconArrow} alt="" width={24} height={24} />;
}
