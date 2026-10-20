import type { ReactNode } from "react";

export default function SurveyIntroPanel({ children }: { children?: ReactNode }) {
  return (
    <header className="bg-surface-highlight relative overflow-hidden rounded-[24px] px-5 py-6 sm:px-8 sm:py-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:px-10 lg:py-10">
      <div
        className="bg-gradient-blue-green pointer-events-none absolute -top-20 -right-20 size-72 rounded-full opacity-15 blur-3xl"
        aria-hidden
      />
      <div className="relative flex min-w-0 flex-col gap-3 sm:gap-4">
        <h1 className="font-body text-heading min-w-0 text-[28px] leading-snug font-semibold text-balance [overflow-wrap:anywhere] sm:text-[32px]">
          Survey Kepuasan Pelanggan
        </h1>
        <p className="font-body text-heading/75 text-sm leading-6 text-pretty sm:text-base">
          Isi singkat ini membantu kami merawat pelayanan klinik. Nama boleh dikosongkan. Perkiraan
          waktu: sekitar tiga menit.
        </p>
        {children}
      </div>
    </header>
  );
}
