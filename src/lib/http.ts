/** Short shared cache for public CMS reads; CMS edits show up within ~5 minutes. */
export const PUBLIC_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400";

export function jsonResponse(status: number, body: unknown, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export const JSON_BODY_MAX_BYTES = 16 * 1024;

export async function readLimited(
  request: Request,
  maxBytes: number,
): Promise<Uint8Array<ArrayBuffer> | null> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return null;
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export type JsonBody = { ok: true; data: unknown } | { ok: false; response: Response };

/** Error bodies match the `{ ok: false, error }` shape used by the survey and /kelola APIs. */
export async function readJsonBody(
  request: Request,
  maxBytes = JSON_BODY_MAX_BYTES,
): Promise<JsonBody> {
  const bytes = await readLimited(request, maxBytes);
  if (!bytes) return { ok: false, response: jsonResponse(413, { ok: false, error: "validation" }) };
  try {
    return { ok: true, data: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return { ok: false, response: jsonResponse(400, { ok: false, error: "validation" }) };
  }
}
