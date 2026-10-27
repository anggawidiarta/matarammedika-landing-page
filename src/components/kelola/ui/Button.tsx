import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { gradientBg } from "@/components/shared/ui/gradient";

type Variant = "primary" | "secondary" | "danger" | "quiet";

const BASE =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-6 font-body text-base font-semibold transition-[transform,background-color,box-shadow,opacity] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:cursor-not-allowed disabled:opacity-50 motion-safe:enabled:active:scale-[0.96] motion-reduce:transition-none";

const VARIANTS: Record<Variant, string> = {
  primary: `${gradientBg} text-white shadow-cta motion-safe:enabled:hover:-translate-y-0.5`,
  secondary: "bg-white text-heading ring-1 ring-heading/15 enabled:hover:bg-surface-tint",
  danger: "bg-danger text-white enabled:hover:opacity-90",
  quiet: "px-4 text-heading/80 enabled:hover:bg-surface-tint enabled:hover:text-heading",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${BASE} ${VARIANTS[variant]} ${extra}`.trim();
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, className)}
      {...rest}
    >
      {loading && (
        <Loader2 size={18} aria-hidden className="animate-spin motion-reduce:animate-none" />
      )}
      {children}
    </button>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  tone?: "default" | "danger";
  children: ReactNode;
};

export function IconButton({
  label,
  tone = "default",
  className = "",
  children,
  type = "button",
  ...rest
}: IconButtonProps) {
  const toneClass =
    tone === "danger"
      ? "text-danger enabled:hover:bg-danger/10"
      : "text-heading/80 enabled:hover:bg-surface-tint enabled:hover:text-heading";
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`focus-visible:outline-blue inline-flex size-11 cursor-pointer items-center justify-center rounded-lg transition-[background-color,opacity,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 motion-safe:enabled:active:scale-[0.96] motion-reduce:transition-none ${toneClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
