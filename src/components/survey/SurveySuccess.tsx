import { CircleCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { gradientBg } from "@/components/shared/ui/gradient";

export default function SurveySuccess({ onReset }: { onReset: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sectionRef.current?.scrollIntoView({
      block: "start",
      behavior: reduceMotion ? "auto" : "smooth",
    });
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="shadow-card flex scroll-mt-[calc(var(--header-h)+1.5rem)] flex-col items-center gap-6 rounded-3xl bg-white px-8 py-12 text-center"
    >
      <span
        aria-hidden="true"
        className="bg-surface-highlight text-blue flex size-14 items-center justify-center rounded-full"
      >
        <CircleCheck size={28} strokeWidth={1.75} />
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-body text-heading text-2xl font-semibold outline-none"
        >
          Terima kasih atas masukan Anda
        </h2>
        <p className="font-body text-muted text-base leading-6">
          Masukan Anda sudah tersimpan dan akan membantu kami memperbaiki pelayanan Klinik Mataram
          Medika.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href="/"
          className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-white ${gradientBg} font-body shadow-cta focus-visible:outline-blue min-h-12 focus-visible:outline-2 focus-visible:outline-offset-2`}
        >
          Kembali ke beranda
        </a>
        <button
          type="button"
          onClick={onReset}
          className="border-muted font-body text-muted hover:border-blue hover:text-blue focus-visible:outline-blue inline-flex min-h-12 items-center justify-center rounded-full border px-7 py-3 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px"
        >
          Isi lagi
        </button>
      </div>
    </section>
  );
}
