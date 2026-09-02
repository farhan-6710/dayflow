import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  theme_preference: "light" | "dark";
  created_at: string;
  updated_at: string;
};

// Reads the profile row for the logged-in user.
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

// Updates the profile details (e.g. display name, avatar, or theme preference)
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "display_name" | "avatar_url" | "theme_preference">>
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
