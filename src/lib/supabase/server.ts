import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireServerEnv } from "@/lib/env";

let client: SupabaseClient | null = null;

export function getServiceSupabase(): SupabaseClient {
  if (client) return client;

  const url = requireServerEnv("SUPABASE_URL");
  const key = requireServerEnv("SUPABASE_SERVICE_ROLE_KEY");

  client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return client;
}
