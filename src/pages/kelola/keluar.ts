import type { APIRoute } from "astro";
import { forgetVerifiedUser } from "@/lib/kelola/auth";
import { guardSameOrigin } from "@/lib/kelola/http";
import { loginRedirectPath } from "@/lib/kelola/redirect";
import { clearSessionTokens, readSessionTokens } from "@/lib/kelola/session";
import { logoutSso } from "@/lib/kelola/sso";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const rejected = guardSameOrigin(request);
  if (rejected) return rejected;

  const tokens = readSessionTokens(cookies);
  clearSessionTokens(cookies);
  if (tokens) {
    forgetVerifiedUser(tokens.accessToken);
    await logoutSso(tokens.accessToken);
  }
  return redirect(loginRedirectPath(), 303);
};
