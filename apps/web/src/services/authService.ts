import type { AuthChangeEvent, AuthError, Session, User } from "@supabase/supabase-js";

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

/** This browser only. A global sign-out would end every visitor's session on the shared demo account. */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) {
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthError | null> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error;
}

export type SignUpWithEmailResult =
  | { ok: true; requiresEmailConfirmation: boolean }
  | { ok: false; error: AuthError };

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  emailRedirectPath: string,
): Promise<SignUpWithEmailResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${window.location.origin}${emailRedirectPath}`,
    },
  });

  if (error) {
    return { ok: false, error };
  }
  return { ok: true, requiresEmailConfirmation: Boolean(data.user && !data.session) };
}

export async function requestPasswordReset(
  email: string,
  redirectPath: string,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}${redirectPath}`,
  });
  return error;
}

export async function updatePassword(password: string): Promise<AuthError | null> {
  const { error } = await supabase.auth.updateUser({
    password,
    data: { password_set: true },
  });
  return error;
}

/**
 * Requests an email change; Supabase emails confirmation links. With secure email
 * change, both inboxes must confirm before `user.email` updates.
 */
export async function updateEmail(email: string, redirectPath: string): Promise<AuthError | null> {
  const { error } = await supabase.auth.updateUser(
    { email: email.trim().toLowerCase() },
    { emailRedirectTo: `${window.location.origin}${redirectPath}` },
  );
  return error;
}

/** Keeps auth `user_metadata.full_name` in sync with the profile display name. */
export async function updateAuthDisplayName(fullName: string): Promise<AuthError | null> {
  const { error } = await supabase.auth.updateUser({ data: { full_name: fullName.trim() } });
  return error;
}

/** Resolves after the client has finished any code exchange from the current URL. */
export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
}
