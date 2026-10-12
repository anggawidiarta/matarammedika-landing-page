import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireServerEnv } from "@/lib/env";

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export function resolveClientIp(
  request: Request,
  clientAddress: string | undefined,
): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
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
