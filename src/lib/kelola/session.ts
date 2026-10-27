import type { AstroCookies } from "astro";
import type { SsoTokens } from "@/lib/kelola/sso";

const ACCESS_COOKIE = "kelola_at";
const REFRESH_COOKIE = "kelola_rt";
const STATE_COOKIE = "kelola_state";

const SESSION_MAX_AGE_S = 7 * 24 * 60 * 60;
const STATE_MAX_AGE_S = 10 * 60;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
    maxAge,
  } as const;
}

export function readSessionTokens(cookies: AstroCookies): SsoTokens | null {
  const accessToken = cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookies.get(REFRESH_COOKIE)?.value;
  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
}

export function writeSessionTokens(cookies: AstroCookies, tokens: SsoTokens): void {
  cookies.set(ACCESS_COOKIE, tokens.accessToken, cookieOptions(SESSION_MAX_AGE_S));
  cookies.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(SESSION_MAX_AGE_S));
}

export function clearSessionTokens(cookies: AstroCookies): void {
  cookies.delete(ACCESS_COOKIE, { path: "/" });
  cookies.delete(REFRESH_COOKIE, { path: "/" });
}

export function issueLoginState(cookies: AstroCookies): string {
  const state = crypto.randomUUID();
  cookies.set(STATE_COOKIE, state, cookieOptions(STATE_MAX_AGE_S));
  return state;
}

/** Single use: the cookie is removed whether or not the state matches. */
export function consumeLoginState(cookies: AstroCookies, received: string | null): boolean {
  const expected = cookies.get(STATE_COOKIE)?.value;
  cookies.delete(STATE_COOKIE, { path: "/" });
  return Boolean(expected && received && expected === received);
}
