import { supabase } from "@lib/supabase";
import { DB } from "@services/db";

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }

  const userId = data.user?.id;
  if (!userId) {
    throw new Error("Not authenticated");
  }

  return userId;
}

export async function storeExpoPushToken(token: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from(DB.EXPO_PUSH_TOKENS.TABLE).upsert(
    {
      user_id: userId,
      token,
      last_used_at: new Date().toISOString(),
    },
    { onConflict: "token" },
  );

  if (error) {
    throw new Error(error.message);
  }
}
