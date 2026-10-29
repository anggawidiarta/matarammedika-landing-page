import type { APIContext, MiddlewareNext } from "astro";
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

const KELOLA_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
};

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-Frame-Options": "DENY",
  ...(import.meta.env.PROD && {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  }),
};

/** Appended, never set: Astro already sends its own script/style policy in this header on SSR routes. */
const FRAME_ANCESTORS_POLICY = "frame-ancestors 'none'";

function withHeaders(response: Response, headers: Record<string, string>): Response {
  const apply = (target: Response) => {
    for (const [name, value] of Object.entries(headers)) target.headers.set(name, value);
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

function withSecurityHeaders(response: Response): Response {
  const secured = withHeaders(response, SECURITY_HEADERS);
  secured.headers.append("Content-Security-Policy", FRAME_ANCESTORS_POLICY);
  return secured;
}

function withKelolaHeaders(response: Response): Response {
  return withHeaders(response, KELOLA_HEADERS);
}

async function handleRequest(context: APIContext, next: MiddlewareNext): Promise<Response> {
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
}

export const onRequest = defineMiddleware(async (context, next) =>
  withSecurityHeaders(await handleRequest(context, next)),
);
