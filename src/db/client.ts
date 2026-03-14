import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. " +
        "Copy .env.example to .env and fill in your Supabase credentials."
      );
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export { _supabase as supabase };
