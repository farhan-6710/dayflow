import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { UserSettings } from "@/shared/types/types";

type UserSettingsRow = UserSettings & { user_id: string };

function toSettings(row: UserSettingsRow): UserSettings {
  return {
    page_transitions: row.page_transitions,
    in_app_reminders: row.in_app_reminders,
    email_updates: row.email_updates,
    desktop_alerts: row.desktop_alerts,
    weekly_digest: row.weekly_digest,
  };
}

/** The user's saved settings, or null when they have never changed one. */
export async function fetchUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from(DB.USER_SETTINGS.TABLE)
    .select(DB.USER_SETTINGS.SELECT)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toSettings(data as UserSettingsRow) : null;
}

/** Creates the row on the first change, then updates it. */
export async function saveUserSettings(userId: string, settings: UserSettings): Promise<UserSettings> {
  const { data, error } = await supabase
    .from(DB.USER_SETTINGS.TABLE)
    .upsert({ user_id: userId, ...settings }, { onConflict: "user_id" })
    .select(DB.USER_SETTINGS.SELECT)
    .single();

  if (error) {
    throw error;
  }

  return toSettings(data as UserSettingsRow);
}
