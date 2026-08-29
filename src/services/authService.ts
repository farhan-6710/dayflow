import type {
  AuthChangeEvent,
  AuthError,
  User,
} from "@supabase/supabase-js";

import { supabase } from "@/services/supabaseClient";
import {
  ADMIN_PORTAL_AUTH_PATH,
  ADMIN_PORTAL_SETTINGS_PATH,
} from "@/app/constants/adminPortalRoutes";

// Returns the signed-in user from the Auth server (not a stale JWT cache).
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return syncAuthUserMetadata(data.user);
}

/** Re-fetch the user from Supabase Auth so email / new_email are up to date. */
export async function refreshCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return syncAuthUserMetadata(data.user);
}

/**
 * Supabase updates `user.email` / identities on email change, but leaves
 * `user_metadata.email` stale. Align metadata with the confirmed login email.
 */
export async function syncAuthUserMetadata(user: User): Promise<User> {
  // Don't rewrite metadata while an email change is still pending.
  if (user.new_email) {
    return user;
  }

  const loginEmail = user.email?.trim().toLowerCase() ?? "";
  if (!loginEmail) {
    return user;
  }

  const metaEmail =
    typeof user.user_metadata?.email === "string"
      ? user.user_metadata.email.trim().toLowerCase()
      : "";

  if (metaEmail === loginEmail) {
    return user;
  }

  const { data, error } = await supabase.auth.updateUser({
    data: {
      email: loginEmail,
      email_verified: true,
    },
  });

  if (error || !data.user) {
    console.error("Failed to sync auth user_metadata.email:", error);
    return user;
  }

  return data.user;
}

/** Keeps auth `user_metadata.full_name` in sync with the profile display name. */
export async function updateAuthDisplayName(
  fullName: string,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName.trim() },
  });
  return error;
}

// Runs the callback whenever the user signs in or out (ignores the first replay).
export function onAuthChange(
  callback: (user: User | null, event: AuthChangeEvent) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "INITIAL_SESSION") {
      return;
    }
    callback(session?.user ?? null, event);
  });

  return () => data.subscription.unsubscribe();
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
): Promise<AuthError | null> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return error;
  }

  if (data.session) {
    return null;
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return signInError;
}

export async function signInWithOAuthProvider(
  provider: string,
  isSignup: boolean,
): Promise<AuthError | null> {
  // Empty handler for now as per user instruction
  console.log("OAuth clicked (skipped for now):", provider, isSignup);
  return null;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function updatePassword(
  password: string,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.updateUser({
    password,
    data: { password_set: true },
  });
  return error;
}

/**
 * Requests an email change. Supabase emails a confirmation link.
 * With Secure email change (default), both the current and new inbox must confirm
 * before `user.email` updates — until then `user.new_email` stays pending.
 */
export async function updateEmail(
  email: string,
): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.updateUser(
    { email: email.trim().toLowerCase() },
    {
      emailRedirectTo: `${window.location.origin}${ADMIN_PORTAL_SETTINGS_PATH}?email-change=pending`,
    },
  );
  return { user: data.user ?? null, error };
}

export async function requestPasswordReset(
  email: string,
  redirectPath: string = `${ADMIN_PORTAL_AUTH_PATH}?form-type=reset-password`,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}${redirectPath}`,
  });
  return error;
}
