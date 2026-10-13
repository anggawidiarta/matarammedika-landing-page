import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireServerEnv } from "@/lib/env";

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function trustProxyEnabled(): boolean {
  const fromProcess = process.env.TRUST_PROXY?.trim().toLowerCase();
  if (fromProcess === "1" || fromProcess === "true") return true;
  const fromMeta = (import.meta.env as Record<string, unknown>).TRUST_PROXY;
  if (typeof fromMeta === "string") {
    const value = fromMeta.trim().toLowerCase();
    return value === "1" || value === "true";
  }
  return false;
}

/**
 * Resolve client IP for rate limiting.
 * Only trusts `x-forwarded-for` when `TRUST_PROXY=1|true` (set behind a stripping reverse proxy).
 * Otherwise uses Astro `clientAddress`.
 */
export function resolveClientIp(
  request: Request,
  clientAddress: string | undefined,
): string {
  if (trustProxyEnabled()) {
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
  const pepper = requireServerEnv("SURVEY_IP_HASH_PEPPER");
  return createHash("sha256").update(`${pepper}|${ip}`).digest("hex");
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
