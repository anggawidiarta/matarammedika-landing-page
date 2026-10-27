export const DEFAULT_LANDING_PATH = "/kelola/layanan";
export const LOGIN_PATH = "/kelola/masuk";

const PLACEHOLDER_ORIGIN = "https://kelola.invalid";

/** Open-redirect guard: only same-site paths under /kelola are honoured. */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/kelola") || raw.includes("\\")) return DEFAULT_LANDING_PATH;
  try {
    const url = new URL(raw, PLACEHOLDER_ORIGIN);
    const underKelola = url.pathname === "/kelola" || url.pathname.startsWith("/kelola/");
    if (url.origin !== PLACEHOLDER_ORIGIN || !underKelola) return DEFAULT_LANDING_PATH;
    return `${url.pathname}${url.search}`;
  } catch {
    return DEFAULT_LANDING_PATH;
  }
}

export function loginRedirectPath(options: { next?: string; reason?: string } = {}): string {
  const params = new URLSearchParams();
  if (options.reason) params.set("alasan", options.reason);
  if (options.next) params.set("next", options.next);
  const query = params.toString();
  return query ? `${LOGIN_PATH}?${query}` : LOGIN_PATH;
}
