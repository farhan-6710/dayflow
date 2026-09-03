import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { createClient, processLock } from "@supabase/supabase-js";

const extra = Constants.expoConfig?.extra ?? {};

export const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl;
export const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_KEY ?? extra.supabaseKey;

export function getSupabaseHost(): string {
  try {
    return supabaseUrl ? new URL(supabaseUrl).host : "missing-supabase-url";
  } catch {
    return "invalid-supabase-url";
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase URL or key is missing. Expo Go uses .env.local; APKs use EAS env vars.",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});
