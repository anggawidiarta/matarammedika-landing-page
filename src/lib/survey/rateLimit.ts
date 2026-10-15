import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SURVEY_IP_HASH_PEPPER, TRUST_PROXY } from "astro:env/server";

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const trustProxyEnabled = ["1", "true"].includes(TRUST_PROXY?.trim().toLowerCase() ?? "");

/**
 * Resolve client IP for rate limiting.
 * Only trusts `x-forwarded-for` when `TRUST_PROXY=1|true` (set behind a stripping reverse proxy).
 * Otherwise uses Astro `clientAddress`.
 */
export function resolveClientIp(
  request: Request,
  clientAddress: string | undefined,
): string {
  if (trustProxyEnabled) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      const first = forwarded.split(",")[0]?.trim();
      if (first) return first;
    }
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
