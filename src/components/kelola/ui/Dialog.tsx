import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "@/components/kelola/ui/Button";

type DialogSize = "sm" | "md" | "lg";

type DialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  busy?: boolean;
};

const SIZE_CLASS: Record<DialogSize, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-6xl",
};

/** Native modal <dialog>: focus trap, Esc and focus return come from the browser. Mark the element to focus first with `data-autofocus` (React's autoFocus runs before showModal and is lost). */
export default function Dialog({
  open,
  title,
  onClose,
  children,
  footer,
  size = "md",
  busy = false,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className={`kelola-dialog text-heading shadow-float m-auto max-h-[min(90dvh,52rem)] w-full flex-col overflow-hidden rounded-2xl bg-white p-0 open:flex max-sm:m-0 max-sm:h-dvh max-sm:max-h-none max-sm:max-w-none max-sm:rounded-none ${SIZE_CLASS[size]}`}
    >
      {open && (
        <>
          <div className="border-heading/8 flex items-center justify-between gap-4 border-b py-2 pr-3 pl-5 sm:pl-6">
            <h2 id={titleId} className="text-lg leading-snug font-semibold text-balance sm:text-xl">
              {title}
            </h2>
            <IconButton label="Tutup" onClick={onClose} disabled={busy} className="shrink-0">
              <X size={20} aria-hidden />
            </IconButton>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            {children}
          </div>
          {footer && (
            <div className="border-heading/8 bg-surface flex flex-col-reverse gap-2 border-t px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
              {footer}
            </div>
          )}
        </>
      )}
    </dialog>
  );
}
