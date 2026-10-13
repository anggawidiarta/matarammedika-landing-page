import KlinikPageShell from "@/components/shared/layout/KlinikPageShell";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";
import SurveyForm from "./SurveyForm";
import SurveySuccess from "./SurveySuccess";
import { useSurveyForm } from "./useSurveyForm";

export default function SurveyKepuasanPage() {
  const form = useSurveyForm();

  return (
    <KlinikPageShell>
      <main className="mx-auto flex max-w-[760px] flex-col gap-8 px-6 pt-8 pb-24">
        <KlinikPageTitle
          title="Survey Kepuasan Pelanggan"
          caption="Isi singkat ini membantu kami merawat pelayanan klinik. Nama boleh dikosongkan. Perkiraan waktu: sekitar tiga menit."
        />

        {form.status === "success" ? (
          <SurveySuccess onReset={form.resetForm} />
        ) : (
          <SurveyForm form={form} />
        )}
      </main>
    </KlinikPageShell>
  );
}
