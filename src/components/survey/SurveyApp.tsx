import SurveyForm from "./SurveyForm";
import SurveyIntroPanel from "./SurveyIntroPanel";
import SurveyProgress from "./SurveyProgress";
import SurveySuccess from "./SurveySuccess";
import { useSurveyForm } from "./useSurveyForm";

export default function SurveyApp() {
  const form = useSurveyForm();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(300px,1fr)_minmax(0,720px)] lg:items-start lg:gap-10">
      <SurveyIntroPanel>
        {form.status === "success" ? null : (
          <SurveyProgress variant="panel" answered={form.answered} progress={form.progress} />
        )}
      </SurveyIntroPanel>
      <div className="min-w-0">
        {form.status === "success" ? (
          <SurveySuccess onReset={form.resetForm} />
        ) : (
          <SurveyForm form={form} />
        )}
      </div>
    </div>
  );
}
