import { createHash } from "node:crypto";
import type { AstroCookies } from "astro";
import { SITE_ORIGIN } from "astro:env/server";
import { clearSessionTokens, readSessionTokens, writeSessionTokens } from "@/lib/kelola/session";
import {
  fetchUser,
  refreshTokens,
  type SsoFailure,
  type SsoResult,
  type SsoTokens,
  type SsoUser,
} from "@/lib/kelola/sso";

const VERIFY_TTL_MS = 60_000;
const MEMO_MAX_ENTRIES = 200;

const verified = new Map<string, { user: SsoUser; expiresAt: number }>();
const inflightRefresh = new Map<string, Promise<SsoResult<SsoTokens>>>();

export type SessionState =
  | { status: "ok"; user: SsoUser }
  | { status: "none" }
  | { status: "denied"; reason: SsoFailure }
  | { status: "unavailable" };

function fingerprint(accessToken: string): string {
  return createHash("sha256").update(accessToken).digest("hex");
}

export function rememberVerifiedUser(accessToken: string, user: SsoUser): void {
  if (verified.size >= MEMO_MAX_ENTRIES) {
    const now = Date.now();
    for (const [key, entry] of verified) {
      if (entry.expiresAt <= now) verified.delete(key);
    }
    if (verified.size >= MEMO_MAX_ENTRIES) verified.clear();
  }
  verified.set(fingerprint(accessToken), { user, expiresAt: Date.now() + VERIFY_TTL_MS });
}

export function forgetVerifiedUser(accessToken: string): void {
  verified.delete(fingerprint(accessToken));
}

/** Concurrent requests with an expired token share one refresh; refresh tokens may be single-use. */
function refreshOnce(refreshToken: string): Promise<SsoResult<SsoTokens>> {
  const existing = inflightRefresh.get(refreshToken);
  if (existing) return existing;

  const pending = refreshTokens(refreshToken).finally(() => {
    inflightRefresh.delete(refreshToken);
  });
  inflightRefresh.set(refreshToken, pending);
  return pending;
}

export async function resolveSession(cookies: AstroCookies): Promise<SessionState> {
  const tokens = readSessionTokens(cookies);
  if (!tokens) return { status: "none" };

  const cached = verified.get(fingerprint(tokens.accessToken));
  if (cached && cached.expiresAt > Date.now()) return { status: "ok", user: cached.user };

  const current = await fetchUser(tokens.accessToken);
  if (current.ok) {
    rememberVerifiedUser(tokens.accessToken, current.value);
    return { status: "ok", user: current.value };
  }
  if (current.reason === "layanan_tidak_tersedia") return { status: "unavailable" };
  if (current.reason !== "kedaluwarsa") {
    clearSessionTokens(cookies);
    return { status: "denied", reason: current.reason };
  }

  const refreshed = await refreshOnce(tokens.refreshToken);
  if (!refreshed.ok) {
    if (refreshed.reason === "layanan_tidak_tersedia") return { status: "unavailable" };
    clearSessionTokens(cookies);
    return { status: "denied", reason: "kedaluwarsa" };
  }

  const renewed = await fetchUser(refreshed.value.accessToken);
  if (!renewed.ok) {
    if (renewed.reason === "layanan_tidak_tersedia") return { status: "unavailable" };
    clearSessionTokens(cookies);
    return { status: "denied", reason: renewed.reason };
  }

  writeSessionTokens(cookies, refreshed.value);
  rememberVerifiedUser(refreshed.value.accessToken, renewed.value);
  return { status: "ok", user: renewed.value };
}

/** Origin the SSO must send users back to; configured because the container sits behind a TLS-terminating proxy. */
export function publicOrigin(requestUrl: URL): string {
  const configured = SITE_ORIGIN?.trim().replace(/\/+$/, "");
  return configured || requestUrl.origin;
}
