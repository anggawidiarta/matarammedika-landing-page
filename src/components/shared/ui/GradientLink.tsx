import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { gradientBg } from "@/components/shared/ui/gradient";

export function GradientLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-12 gap-2 items-center px-7 py-4 text-lg font-semibold text-white rounded-full ${gradientBg} font-body shadow-cta transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue motion-safe:active:scale-[0.97] motion-reduce:transition-none`}
    >
      {children}
    </a>
  );
}

export function ArrowIcon() {
  return <ArrowRight size={24} aria-hidden strokeWidth={2} />;
}
