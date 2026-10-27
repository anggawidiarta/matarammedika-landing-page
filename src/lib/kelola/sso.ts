import { SSO_USERS_URL } from "astro:env/server";
import { z } from "zod";

export const SSO_APP_KEY = "admin";

const REQUEST_TIMEOUT_MS = 8000;

export type SsoFailure = "gagal" | "tanpa_akses" | "kedaluwarsa" | "layanan_tidak_tersedia";

export type SsoResult<T> = { ok: true; value: T } | { ok: false; reason: SsoFailure };

const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  displayName: z.string().nullable().optional(),
  apps: z.array(z.string()),
});

const tokensSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export type SsoUser = z.infer<typeof userSchema>;
export type SsoTokens = z.infer<typeof tokensSchema>;

/** Optional in the env schema so a missing value disables /kelola instead of failing every public request. */
function endpoint(path: string): string | null {
  const base = SSO_USERS_URL?.trim().replace(/\/+$/, "");
  return base ? `${base}${path}` : null;
}

type Outcome = { kind: "response"; response: Response } | { kind: "unreachable" };

async function callSso(path: string, init: RequestInit): Promise<Outcome> {
  const target = endpoint(path);
  if (!target) {
    console.error("[kelola] SSO_USERS_URL belum dikonfigurasi");
    return { kind: "unreachable" };
  }

  try {
    const response = await fetch(target, {
      ...init,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return { kind: "response", response };
  } catch (error) {
    console.error("[kelola] sso unreachable", path, error instanceof Error ? error.name : error);
    return { kind: "unreachable" };
  }
}

function failureFor(response: Response, clientError: SsoFailure): SsoFailure {
  return response.status >= 500 ? "layanan_tidak_tersedia" : clientError;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function exchangeCode(code: string): Promise<SsoResult<SsoTokens>> {
  const outcome = await callSso("/api/sso/exchange-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (outcome.kind === "unreachable") return { ok: false, reason: "layanan_tidak_tersedia" };
  if (!outcome.response.ok) return { ok: false, reason: failureFor(outcome.response, "gagal") };

  const body = (await readJson(outcome.response)) as { tokens?: unknown } | null;
  const tokens = tokensSchema.safeParse(body?.tokens);
  return tokens.success ? { ok: true, value: tokens.data } : { ok: false, reason: "gagal" };
}

export async function fetchUser(accessToken: string): Promise<SsoResult<SsoUser>> {
  const outcome = await callSso("/api/sso/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (outcome.kind === "unreachable") return { ok: false, reason: "layanan_tidak_tersedia" };
  if (!outcome.response.ok) {
    return { ok: false, reason: failureFor(outcome.response, "kedaluwarsa") };
  }

  const body = (await readJson(outcome.response)) as { user?: unknown } | null;
  const user = userSchema.safeParse(body?.user);
  if (!user.success) return { ok: false, reason: "gagal" };
  if (!user.data.apps.includes(SSO_APP_KEY)) return { ok: false, reason: "tanpa_akses" };
  return { ok: true, value: user.data };
}

export async function refreshTokens(refreshToken: string): Promise<SsoResult<SsoTokens>> {
  const outcome = await callSso("/api/sso/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (outcome.kind === "unreachable") return { ok: false, reason: "layanan_tidak_tersedia" };
  if (!outcome.response.ok) {
    return { ok: false, reason: failureFor(outcome.response, "kedaluwarsa") };
  }

  const body = (await readJson(outcome.response)) as { tokens?: unknown } | null;
  const tokens = tokensSchema.safeParse(body?.tokens);
  return tokens.success ? { ok: true, value: tokens.data } : { ok: false, reason: "kedaluwarsa" };
}

export async function logoutSso(accessToken: string): Promise<void> {
  await callSso("/api/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function buildLoginUrl(redirectUrl: string): string | null {
  const loginEndpoint = endpoint("/login");
  if (!loginEndpoint) return null;

  const url = new URL(loginEndpoint);
  url.searchParams.set("app", SSO_APP_KEY);
  url.searchParams.set("redirect", redirectUrl);
  return url.toString();
}
