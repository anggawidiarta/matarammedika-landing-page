import { useState } from "react";
import Button from "@/components/kelola/ui/Button";
import Dialog from "@/components/kelola/ui/Dialog";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
    } catch {
      setError("Belum berhasil. Coba lagi beberapa saat lagi.");
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    setError(null);
    onCancel();
  };

  return (
    <Dialog
      open={open}
      title={title}
      onClose={cancel}
      size="sm"
      busy={busy}
      footer={
        <>
          <Button variant="secondary" onClick={cancel} disabled={busy} data-autofocus>
            Batal
          </Button>
          <Button variant="danger" onClick={confirm} loading={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-heading/80 text-base leading-relaxed text-pretty">{message}</p>
      {error && (
        <p role="alert" className="text-danger mt-4 text-sm font-medium">
          {error}
        </p>
      )}
    </Dialog>
  );
}
