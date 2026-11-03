import type { AuthChangeEvent, User } from "@supabase/supabase-js";

import { supabase } from "@/services/supabaseClient";

/** Re-fetch the user from Supabase Auth so email / new_email are up to date. */
export async function refreshCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return syncAuthUserMetadata(data.user);
}

/**
 * Supabase updates `user.email` on email change but leaves `user_metadata.email`
 * stale. Align metadata with the confirmed login email.
 */
export async function syncAuthUserMetadata(user: User): Promise<User> {
  // Don't rewrite metadata while an email change is still pending.
  if (user.new_email) {
    return user;
  }

  const loginEmail = user.email?.trim().toLowerCase() ?? "";
  const metadataEmail: unknown = user.user_metadata?.email;
  const metaEmail =
    typeof metadataEmail === "string" ? metadataEmail.trim().toLowerCase() : "";

  // Sign-up only stores full_name: no metadata email means nothing to align.
  if (!loginEmail || !metaEmail || metaEmail === loginEmail) {
    return user;
  }

  const { data, error } = await supabase.auth.updateUser({
    data: { email: loginEmail, email_verified: true },
  });

  if (error || !data.user) {
    console.error("Failed to sync auth user_metadata.email:", error);
    return user;
  }

  return data.user;
}

/** Runs the callback on every auth state change, including the initial session. */
export function onAuthChange(
  callback: (user: User | null, event: AuthChangeEvent) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null, event);
  });

  return () => data.subscription.unsubscribe();
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}
