import type { APIRoute } from "astro";
import { publicOrigin } from "@/lib/kelola/auth";
import { loginRedirectPath, safeNextPath } from "@/lib/kelola/redirect";
import { issueLoginState } from "@/lib/kelola/session";
import { buildLoginUrl } from "@/lib/kelola/sso";

export const prerender = false;

export const GET: APIRoute = ({ url, cookies, redirect }) => {
  const callback = new URL("/kelola/callback", publicOrigin(url));
  callback.searchParams.set("state", issueLoginState(cookies));
  callback.searchParams.set("next", safeNextPath(url.searchParams.get("next")));
  const loginUrl = buildLoginUrl(callback.toString());
  return redirect(loginUrl ?? loginRedirectPath({ reason: "layanan_tidak_tersedia" }));
};
