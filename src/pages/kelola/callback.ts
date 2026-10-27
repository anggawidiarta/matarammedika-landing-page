import type { APIRoute } from "astro";
import { rememberVerifiedUser } from "@/lib/kelola/auth";
import { loginRedirectPath, safeNextPath } from "@/lib/kelola/redirect";
import { consumeLoginState, writeSessionTokens } from "@/lib/kelola/session";
import { exchangeCode, fetchUser } from "@/lib/kelola/sso";

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const stateMatches = consumeLoginState(cookies, url.searchParams.get("state"));
  const code = url.searchParams.get("code");
  if (!stateMatches || !code) return redirect(loginRedirectPath({ reason: "gagal" }));

  const exchanged = await exchangeCode(code);
  if (!exchanged.ok) return redirect(loginRedirectPath({ reason: exchanged.reason }));

  const user = await fetchUser(exchanged.value.accessToken);
  if (!user.ok) return redirect(loginRedirectPath({ reason: user.reason }));

  writeSessionTokens(cookies, exchanged.value);
  rememberVerifiedUser(exchanged.value.accessToken, user.value);
  return redirect(safeNextPath(url.searchParams.get("next")));
};
