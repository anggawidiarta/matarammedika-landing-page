/** Short shared cache for public CMS reads; CMS edits show up within ~5 minutes. */
export const PUBLIC_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400";

export function jsonResponse(status: number, body: unknown, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}
