import { gradientBg } from "@/components/shared/data/constants";

export default function SurveySuccess({ onReset }: { onReset: () => void }) {
  return (
    <section
      className="flex flex-col gap-6 items-center px-8 py-12 text-center bg-white rounded-3xl shadow-card"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="flex justify-center items-center text-2xl font-semibold rounded-full size-14 bg-surface-highlight text-blue"
      >
        ✓
      </span>
      <div className="flex flex-col gap-2 min-w-0">
        <h2 className="text-2xl font-semibold font-body text-heading">
          Terima kasih atas masukan Anda
        </h2>
        <p className="text-base leading-6 font-body text-muted">
          Masukan Anda sudah tersimpan dan akan membantu kami memperbaiki
          pelayanan Klinik Mataram Medika.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center items-center">
        <a
          href="/"
          className={`inline-flex justify-center items-center px-7 py-3 text-base font-semibold text-white rounded-full ${gradientBg} min-h-12 font-body shadow-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue`}
        >
          Kembali ke beranda
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex justify-center items-center px-7 py-3 text-base font-semibold rounded-full border min-h-12 border-muted font-body text-muted hover:border-blue hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue active:translate-y-px"
        >
          Isi lagi
        </button>
      </div>
    </section>
  );
}
