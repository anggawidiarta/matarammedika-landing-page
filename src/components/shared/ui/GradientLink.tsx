import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { gradientBg } from "@/components/shared/data/constants";

export function GradientLink({ href, children }: { href: string; children: ReactNode }) {
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
  return <ArrowRight size={24} aria-hidden strokeWidth={2} />;
}
