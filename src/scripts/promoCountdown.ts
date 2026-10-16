const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

let timer: number | undefined;

function render(root: HTMLElement, remaining: number) {
  if (remaining <= 0) {
    root.querySelectorAll<HTMLElement>("[data-countdown-live]").forEach((el) => (el.hidden = true));
    root.querySelector<HTMLElement>("[data-countdown-ended]")!.hidden = false;
    return;
  }
  const parts = {
    day: Math.floor(remaining / DAY),
    hour: Math.floor(remaining / HOUR) % 24,
    minute: Math.floor(remaining / MINUTE) % 60,
    second: Math.floor(remaining / SECOND) % 60,
  };
  for (const [unit, value] of Object.entries(parts)) {
    root.querySelector<HTMLElement>(`[data-unit="${unit}"]`)!.textContent = String(value).padStart(2, "0");
  }
}

function start() {
  stop();
  const roots = Array.from(document.querySelectorAll<HTMLElement>("[data-promo-countdown]"));
  if (roots.length === 0) return;

  const tick = () => {
    const now = Date.now();
    roots.forEach((root) => render(root, Number(root.dataset.endsAt) - now));
  };
  tick();
  timer = window.setInterval(tick, SECOND);
}

function stop() {
  window.clearInterval(timer);
  timer = undefined;
}

document.addEventListener("astro:page-load", start);
document.addEventListener("astro:before-swap", stop);
