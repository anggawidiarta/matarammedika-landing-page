import { useId, type ReactNode, type SubmitEvent } from "react";
import Button from "@/components/kelola/ui/Button";
import Dialog from "@/components/kelola/ui/Dialog";

type FormDialogProps = {
  open: boolean;
  title: string;
  submitLabel: string;
  submitting: boolean;
  formError: string | null;
  onClose: () => void;
  onSubmit: () => void;
  size?: "md" | "lg";
  children: ReactNode;
};

export default function FormDialog({
  open,
  title,
  submitLabel,
  submitting,
  formError,
  onClose,
  onSubmit,
  size = "md",
  children,
}: FormDialogProps) {
  const formId = useId();

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Dialog
      open={open}
      title={title}
      onClose={onClose}
      size={size}
      busy={submitting}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button type="submit" form={formId} loading={submitting}>
            {submitLabel}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {children}
        {formError && (
          <p role="alert" className="text-danger text-sm leading-6 font-medium">
            {formError}
          </p>
        )}
      </form>
    </Dialog>
  );
}
