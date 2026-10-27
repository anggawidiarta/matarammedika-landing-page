import { defineMiddleware } from "astro:middleware";
import { resolveSession } from "@/lib/kelola/auth";
import { fail } from "@/lib/kelola/http";
import { loginRedirectPath } from "@/lib/kelola/redirect";

const OPEN_KELOLA_PATHS = new Set([
  "/kelola/masuk",
  "/kelola/masuk/sso",
  "/kelola/callback",
  "/kelola/keluar",
]);

function isUnder(path: string, base: string): boolean {
  return path === base || path.startsWith(`${base}/`);
}

function withKelolaHeaders(response: Response): Response {
  const apply = (target: Response) => {
    target.headers.set("X-Robots-Tag", "noindex, nofollow");
    target.headers.set("Cache-Control", "no-store");
    return target;
  };
  try {
    return apply(response);
  } catch {
    return apply(
      new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers),
      }),
    );
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname.replace(/\/+$/, "") || "/";
  const isApi = isUnder(path, "/api/kelola");
  if (!isApi && !isUnder(path, "/kelola")) return next();

  if (!isApi && OPEN_KELOLA_PATHS.has(path)) return withKelolaHeaders(await next());

  const session = await resolveSession(context.cookies);

  if (session.status === "ok") {
    context.locals.kelolaUser = session.user;
    return withKelolaHeaders(await next());
  }

  if (isApi) {
    return withKelolaHeaders(
      session.status === "unavailable" ? fail("server", 503) : fail("unauthenticated"),
    );
  }

  const reason =
    session.status === "denied"
      ? session.reason
      : session.status === "unavailable"
        ? "layanan_tidak_tersedia"
        : undefined;
  const destination = `${path}${context.url.search}`;
  return withKelolaHeaders(context.redirect(loginRedirectPath({ next: destination, reason })));
});
