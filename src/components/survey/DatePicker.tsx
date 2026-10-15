import { useRef, useState, type KeyboardEvent } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { isValidCalendarDate } from "@/lib/survey/date";
import { triggerClass } from "./constants";
import { useDismiss } from "./useDismiss";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function parseIso(value: string): Date | null {
  if (!isValidCalendarDate(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatLong(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Same day-of-month in the month `delta` away, clamped to that month's length. */
function shiftMonth(date: Date, delta: number) {
  const target = new Date(date.getFullYear(), date.getMonth() + delta, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), last));
  return target;
}

export default function DatePicker({
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
  const panelId = `${id}-panel`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ year: 0, month: 0 });
  const [focused, setFocused] = useState("");

  const selected = parseIso(value);

  useDismiss(containerRef, open, () => setOpen(false), closePanel);

  function closePanel() {
    setOpen(false);
    requestAnimationFrame(() => document.getElementById(id)?.focus());
  }

  function focusDay(date: Date) {
    setView({ year: date.getFullYear(), month: date.getMonth() });
    setFocused(toIso(date));
    requestAnimationFrame(() => document.getElementById(`${id}-day-${toIso(date)}`)?.focus());
  }

  function openPanel() {
    const base = selected ?? new Date();
    setView({ year: base.getFullYear(), month: base.getMonth() });
    setFocused(toIso(base));
    setOpen(true);
    requestAnimationFrame(() => document.getElementById(`${id}-day-${toIso(base)}`)?.focus());
  }

  function choose(next: string) {
    onChange(next);
    closePanel();
  }

  /** Month arrows keep the roving tab stop inside the visible month without stealing focus. */
  function stepMonth(delta: number) {
    const next = shiftMonth(parseIso(focused) ?? new Date(view.year, view.month, 1), delta);
    setView({ year: next.getFullYear(), month: next.getMonth() });
    setFocused(toIso(next));
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openPanel();
    }
  }

  function onGridKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = parseIso(focused);
    if (!current) return;
    const step = (days: number) => {
      event.preventDefault();
      focusDay(new Date(current.getFullYear(), current.getMonth(), current.getDate() + days));
    };
    switch (event.key) {
      case "ArrowLeft":
        return step(-1);
      case "ArrowRight":
        return step(1);
      case "ArrowUp":
        return step(-7);
      case "ArrowDown":
        return step(7);
      case "Home":
        return step(-((current.getDay() + 6) % 7));
      case "End":
        return step(6 - ((current.getDay() + 6) % 7));
      case "PageUp":
        event.preventDefault();
        return focusDay(shiftMonth(current, -1));
      case "PageDown":
        event.preventDefault();
        return focusDay(shiftMonth(current, 1));
    }
  }

  const firstOfMonth = new Date(view.year, view.month, 1);
  const leading = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(leading).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const todayIso = toIso(new Date());

  return (
    <div ref={containerRef} className="relative min-w-0">
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        className={triggerClass(invalid, open)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openPanel())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={`truncate ${selected ? "text-heading" : "text-muted/70"}`}>
          {selected ? formatLong(selected) : "Pilih tanggal"}
        </span>
        <CalendarDays aria-hidden size={18} strokeWidth={2} className="shrink-0 text-muted" />
      </button>

      {open ? (
        <>
          <div
            aria-hidden
            className="fixed inset-0 z-20 bg-black/30 sm:hidden"
            onClick={closePanel}
          />
          <div
            id={panelId}
            role="dialog"
            aria-label="Pilih tanggal kunjungan"
            className="select-menu-in fixed inset-x-4 bottom-4 z-30 rounded-3xl bg-white p-4 shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_8px_24px_-6px_oklch(0_0_0/0.12),0_2px_6px_oklch(0_0_0/0.04)] sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-[calc(100%+0.5rem)] sm:w-80 sm:rounded-2xl sm:p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <button
                type="button"
                aria-label="Bulan sebelumnya"
                className="flex size-11 items-center justify-center rounded-full text-muted outline-none transition-colors duration-150 hover:bg-surface-tint hover:text-heading focus-visible:outline-2 focus-visible:outline-blue sm:size-9"
                onClick={() => stepMonth(-1)}
              >
                <ChevronLeft aria-hidden size={18} strokeWidth={2} />
              </button>
              <p
                aria-live="polite"
                className="font-body text-sm font-semibold text-heading"
              >
                {MONTHS[view.month]} {view.year}
              </p>
              <button
                type="button"
                aria-label="Bulan berikutnya"
                className="flex size-11 items-center justify-center rounded-full text-muted outline-none transition-colors duration-150 hover:bg-surface-tint hover:text-heading focus-visible:outline-2 focus-visible:outline-blue sm:size-9"
                onClick={() => stepMonth(1)}
              >
                <ChevronRight aria-hidden size={18} strokeWidth={2} />
              </button>
            </div>

            <div role="grid" aria-label={`${MONTHS[view.month]} ${view.year}`} onKeyDown={onGridKeyDown}>
              <div role="row" className="grid grid-cols-7 text-center">
                {WEEKDAYS.map((day) => (
                  <span
                    key={day}
                    role="columnheader"
                    className="py-1 font-body text-xs font-medium text-muted"
                  >
                    {day}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {cells.map((day, index) => {
                  if (day === null) return <span key={`blank-${index}`} role="gridcell" />;
                  const iso = toIso(new Date(view.year, view.month, day));
                  const isSelected = iso === value;
                  const isToday = iso === todayIso;
                  return (
                    <span key={iso} role="gridcell" className="flex justify-center">
                      <button
                        id={`${id}-day-${iso}`}
                        type="button"
                        tabIndex={iso === focused ? 0 : -1}
                        aria-selected={isSelected}
                        aria-current={isToday ? "date" : undefined}
                        className={`flex size-11 items-center justify-center rounded-full font-body text-sm outline-none transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-blue sm:size-10 ${
                          isSelected
                            ? "bg-blue font-semibold text-white"
                            : isToday
                              ? "font-semibold text-blue ring-1 ring-blue/40 hover:bg-surface-highlight"
                              : "text-heading hover:bg-surface-tint"
                        }`}
                        onClick={() => choose(iso)}
                      >
                        {day}
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-muted/15 pt-2">
              <button
                type="button"
                className="min-h-11 rounded-xl px-3 font-body text-sm font-medium text-blue outline-none transition-colors duration-150 hover:bg-surface-highlight focus-visible:outline-2 focus-visible:outline-blue sm:min-h-9"
                onClick={() => choose(todayIso)}
              >
                Hari ini
              </button>
              {value ? (
                <button
                  type="button"
                  className="min-h-11 rounded-xl px-3 font-body text-sm font-medium text-muted outline-none transition-colors duration-150 hover:bg-surface-tint hover:text-heading focus-visible:outline-2 focus-visible:outline-blue sm:min-h-9"
                  onClick={() => choose("")}
                >
                  Hapus
                </button>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
