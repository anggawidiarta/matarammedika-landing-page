import { useCallback, useRef, useState } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { IconButton } from "@/components/kelola/ui/Button";

type ToastTone = "success" | "error";
type ToastMessage = { id: number; tone: ToastTone; text: string };

const SUCCESS_VISIBLE_MS = 4000;

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, text: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, tone, text }]);
      if (tone === "success") window.setTimeout(() => dismiss(id), SUCCESS_VISIBLE_MS);
    },
    [dismiss],
  );

  return {
    toasts,
    dismiss,
    success: (text: string) => push("success", text),
    error: (text: string) => push("error", text),
  };
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  const isError = toast.tone === "error";
  const Icon = isError ? CircleAlert : CircleCheck;
  return (
    <div
      role={isError ? "alert" : "status"}
      className="kelola-toast shadow-float flex items-start gap-3 rounded-xl bg-white py-2 pr-2 pl-4"
    >
      <Icon
        size={22}
        aria-hidden
        className={`mt-2.5 shrink-0 ${isError ? "text-danger" : "text-green"}`}
      />
      <p className="text-heading flex-1 py-2.5 text-sm leading-6">{toast.text}</p>
      {isError && (
        <IconButton label="Tutup pesan" onClick={onDismiss} className="shrink-0">
          <X size={18} aria-hidden />
        </IconButton>
      )}
    </div>
  );
}

export function ToastRegion({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] mx-auto flex max-w-md flex-col gap-2 *:pointer-events-auto"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}
