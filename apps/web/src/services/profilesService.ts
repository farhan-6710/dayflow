import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Profile } from "@/shared/types/types";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from(DB.PROFILES.TABLE)
    .select(DB.PROFILES.SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Profile | null) ?? null;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "display_name" | "avatar_url">>,
): Promise<Profile> {
  const { data, error } = await supabase
    .from(DB.PROFILES.TABLE)
    .update(updates)
    .eq("id", userId)
    .select(DB.PROFILES.SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
}
