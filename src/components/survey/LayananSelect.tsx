import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { LAYANAN_VALUES } from "@/lib/survey/constants";
import { triggerClass } from "./constants";
import { useDismiss } from "./useDismiss";

const PLACEHOLDER = "Pilih layanan";
const OPTIONS = LAYANAN_VALUES.map((option) => ({ value: option, label: option }));

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

  const selectedLabel = value
    ? (OPTIONS.find((option) => option.value === value)?.label ?? PLACEHOLDER)
    : PLACEHOLDER;

  useDismiss(containerRef, open, () => setOpen(false), closeMenu);

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
        className={triggerClass(invalid, open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={`truncate ${value ? "text-heading pr-8" : "text-muted/70"}`}>
          {selectedLabel}
        </span>
        <ChevronDown
          aria-hidden
          size={18}
          strokeWidth={2}
          className={`shrink-0 text-muted transition-transform duration-200 ease-out ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {value ? (
        <button
          type="button"
          aria-label="Hapus pilihan layanan"
          className="absolute right-11 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted outline-none transition-colors duration-150 hover:bg-surface-highlight hover:text-heading focus-visible:outline-2 focus-visible:outline-blue"
          onClick={() => {
            onChange("");
            setOpen(false);
            document.getElementById(id)?.focus();
          }}
        >
          <X aria-hidden size={14} strokeWidth={2} />
        </button>
      ) : null}

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={id}
          aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
          onKeyDown={onListKeyDown}
          className="select-menu-in absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 flex flex-col gap-1 rounded-2xl bg-white p-1.5 shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_8px_24px_-6px_oklch(0_0_0/0.12),0_2px_6px_oklch(0_0_0/0.04)] outline-none"
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
                  className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left font-body text-sm transition-[background-color,color] duration-150 ease-out ${
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
