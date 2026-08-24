import type {
  AuthChangeEvent,
  AuthError,
  User,
} from "@supabase/supabase-js";

import { supabase } from "@/services/supabaseClient";

// Returns the signed-in user, or null when nobody is logged in.
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
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

export async function requestPasswordReset(
  email: string,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/auth?form-type=reset-password`,
  });
  return error;
}
