import { createClient } from "@supabase/supabase-js";

// Base connection for every service. All API calls go through this single client.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
}

/** For calls supabase-js can't make itself, such as reading an Edge Function's streamed reply. */
export const supabaseConfig = { url: supabaseUrl, publishableKey: supabaseKey } as const;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: "pkce",
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});
