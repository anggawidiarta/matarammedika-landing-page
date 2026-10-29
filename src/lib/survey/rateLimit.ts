import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SURVEY_IP_HASH_PEPPER, TRUST_PROXY } from "astro:env/server";

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function parseTrustedProxyHops(raw: string | undefined): number {
  const value = raw?.trim().toLowerCase() ?? "";
  if (value === "" || value === "0" || value === "false") return 0;
  if (value === "true") return 1;
  if (/^[1-9]\d*$/.test(value)) return Number(value);
  console.warn("[survey] TRUST_PROXY tidak dikenali, X-Forwarded-For diabaikan");
  return 0;
}

const trustedProxyHops = parseTrustedProxyHops(TRUST_PROXY);

/**
 * Resolve client IP for rate limiting.
 * With `TRUST_PROXY=N` the Nth entry from the right of `x-forwarded-for` is used: each trusted
 * proxy appends the address it received from, so the right-hand entries cannot be forged by the
 * client, while anything the client prepended on the left is ignored.
 * Without it, or when the header has fewer entries than hops, Astro `clientAddress` is used.
 */
export function resolveClientIp(
  request: Request,
  clientAddress: string | undefined,
): string {
  if (trustedProxyHops > 0) {
    const entries = (request.headers.get("x-forwarded-for") ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    const trusted = entries[entries.length - trustedProxyHops];
    if (trusted) return trusted;
  }
  if (clientAddress?.trim()) return clientAddress.trim();
  return "unknown";
}

export function hashClientIp(ip: string): string {
  return createHash("sha256").update(`${SURVEY_IP_HASH_PEPPER}|${ip}`).digest("hex");
}

export async function isRateLimited(
  supabase: SupabaseClient,
  ipHash: string,
): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count, error } = await supabase
    .from("survey_kepuasan_pelanggan")
    .select("id", { count: "exact", head: true })
    .eq("client_ip_hash", ipHash)
    .gt("created_at", since);

  if (error) throw error;
  return (count ?? 0) >= RATE_LIMIT_MAX;
}
