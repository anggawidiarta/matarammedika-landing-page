import { SITE_ORIGIN } from "astro:env/server";
import { jsonResponse, readLimited } from "@/lib/http";

export type KelolaErrorCode =
  "validation" | "not_found" | "conflict" | "unauthenticated" | "server";

const ERROR_STATUS: Record<KelolaErrorCode, number> = {
  validation: 400,
  unauthenticated: 401,
  not_found: 404,
  conflict: 409,
  server: 500,
};

export function ok(body: Record<string, unknown> = {}, status = 200) {
  return jsonResponse(status, { ok: true, ...body });
}

export function fail(
  code: KelolaErrorCode,
  status = ERROR_STATUS[code],
  extra: Record<string, unknown> = {},
) {
  return jsonResponse(status, { ok: false, error: code, ...extra });
}

/**
 * Astro does not trust the Host header unless allowedDomains is configured, so behind a proxy
 * `request.url` always reads as localhost. The configured public origin is therefore the reference.
 */
function expectedOrigin(request: Request): string {
  return SITE_ORIGIN?.trim().replace(/\/+$/, "") || new URL(request.url).origin;
}

/** Browsers always send Origin on cross-site POSTs, so a missing or different one is rejected. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return origin !== null && origin === expectedOrigin(request);
}

/** Rejects cross-site and non-JSON writes; the JSON content type cannot be sent by a plain HTML form. */
export function guardJsonWrite(request: Request): Response | null {
  if (!isSameOrigin(request)) return fail("validation", 403);
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) return fail("validation", 415);
  return null;
}

export function guardSameOrigin(request: Request): Response | null {
  return isSameOrigin(request) ? null : fail("validation", 403);
}

/** Multipart bodies are buffered under the same cap as JSON so an oversized upload never reaches the parser. */
export async function readMultipart(request: Request, maxBytes: number): Promise<FormData | null> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) return null;

  const bytes = await readLimited(request, maxBytes);
  if (!bytes) return null;
  try {
    return await new Response(bytes, { headers: { "content-type": contentType } }).formData();
  } catch {
    return null;
  }
}
