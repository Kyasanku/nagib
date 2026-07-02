import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, isSupabaseConfigured } from "./config";

// Service-role client for trusted server code only (checkout, webhook,
// fulfilment). It bypasses Row Level Security, so NEVER import this into a
// client component or expose the key. Returns null when not configured.
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!isSupabaseConfigured || !serviceKey) return null;
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const isServiceConfigured =
  isSupabaseConfigured && (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").length > 0;
