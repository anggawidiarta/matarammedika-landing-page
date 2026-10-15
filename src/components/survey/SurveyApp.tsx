import SurveyForm from "./SurveyForm";
import SurveySuccess from "./SurveySuccess";
import { useSurveyForm } from "./useSurveyForm";

export default function SurveyApp() {
  const form = useSurveyForm();

  return form.status === "success" ? (
    <SurveySuccess onReset={form.resetForm} />
  ) : (
    <SurveyForm form={form} />
  );
}
