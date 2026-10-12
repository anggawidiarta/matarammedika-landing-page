import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { LAYANAN_OPTIONS } from "./constants";

const PLACEHOLDER = "Pilih layanan";
const OPTIONS = [
  { value: "", label: PLACEHOLDER },
  ...LAYANAN_OPTIONS.map((option) => ({ value: option, label: option })),
];

export default function LayananSelect({
  id,
  name,
  value,
  onChange,
  invalid = false,
  describedBy,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (next: string) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const listboxId = `${id}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedLabel = OPTIONS.find((option) => option.value === value)?.label ?? PLACEHOLDER;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      requestAnimationFrame(() => {
        document.getElementById(id)?.focus();
      });
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, id]);

  useEffect(() => {
    if (!open) return;
    const index = Math.max(
      0,
      OPTIONS.findIndex((option) => option.value === value),
    );
    setActiveIndex(index);
    requestAnimationFrame(() => {
      document.getElementById(listboxId)?.focus();
    });
  }, [open, value, listboxId]);

  function closeMenu() {
    setOpen(false);
    requestAnimationFrame(() => {
      document.getElementById(id)?.focus();
    });
  }

  function choose(next: string) {
    onChange(next);
    closeMenu();
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % OPTIONS.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((current) => (current <= 0 ? OPTIONS.length - 1 : current - 1));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(OPTIONS.length - 1);
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const option = OPTIONS[activeIndex];
        if (option) choose(option.value);
        break;
      }
      case "Escape":
        event.preventDefault();
        closeMenu();
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative min-w-0">
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        className={`flex min-h-12 w-full min-w-0 items-center justify-between gap-3 rounded-2xl border bg-surface-tint px-4 py-3 text-left font-body text-sm text-heading shadow-[0_0_0_1px_oklch(0_0_0/0.04),0_1px_2px_-1px_oklch(0_0_0/0.05)] outline-none transition-[border-color,box-shadow,background-color,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue active:scale-[0.96] motion-reduce:active:scale-100 ${
          invalid
            ? "border-promo focus-visible:outline-promo"
            : open
              ? "border-blue/50 hover:border-muted/50"
              : "border-muted/30 hover:border-muted/50"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={value ? "text-heading" : "text-muted/70"}>{selectedLabel}</span>
        <ChevronDown
          aria-hidden
          size={18}
          strokeWidth={2}
          className={`shrink-0 text-muted transition-transform duration-200 ease-out ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={id}
          aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
          onKeyDown={onListKeyDown}
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 flex flex-col gap-1 rounded-2xl bg-white p-1.5 shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_8px_24px_-6px_oklch(0_0_0/0.12),0_2px_6px_oklch(0_0_0/0.04)] outline-none"
        >
          {OPTIONS.map((option, index) => {
            const selected = option.value === value;
            const active = index === activeIndex;
            return (
              <li key={option.label} role="presentation">
                <button
                  id={`${id}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left font-body text-sm transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96] motion-reduce:active:scale-100 ${
                    selected
                      ? "bg-surface-highlight font-medium text-blue"
                      : active
                        ? "bg-surface-tint text-heading"
                        : "text-heading hover:bg-surface-tint"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(option.value)}
                >
                  <span>{option.label}</span>
                  <Check
                    aria-hidden
                    size={16}
                    strokeWidth={2}
                    className={`shrink-0 transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                      selected
                        ? "scale-100 opacity-100 blur-0"
                        : "scale-[0.25] opacity-0 blur-[4px]"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
