import type {
  AuthChangeEvent,
  AuthError,
  Provider,
  User,
} from "@supabase/supabase-js";

import { supabase } from "@/services/supabaseClient";
import {
  WORKSPACE_AUTH_PATH,
  WORKSPACE_DASHBOARD_PATH,
  WORKSPACE_SETTINGS_PATH,
} from "@/app/constants/workspaceRoutes";
import { OAUTH_CALLBACK_PATH } from "@/app/constants/oauthRoutes";
import {
  buildDesktopOAuthBridgeUrl,
  openDesktopOAuth,
} from "@/features/workspace/auth/utils/oauthDesktop";
import {
  openOAuthPopup,
  type OAuthPopupResult,
} from "@/features/workspace/auth/utils/oauthPopup";
import { isDesktopApp } from "@/shared/utils/platform";

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

  // Sign-up only stores full_name; avoid repeated updateUser → USER_UPDATED loops
  // when provider metadata shape does not mirror login email.
  if (!metaEmail) {
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

// Runs the callback on every auth state change, including the initial session.
export function onAuthChange(
  callback: (user: User | null, event: AuthChangeEvent) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
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

export type SignUpWithEmailResult =
  | { ok: true; requiresEmailConfirmation: boolean }
  | { ok: false; error: AuthError };

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  emailRedirectPath: string = WORKSPACE_DASHBOARD_PATH,
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

  if (data.session) {
    return { ok: true, requiresEmailConfirmation: false };
  }

  if (data.user && !data.session) {
    return { ok: true, requiresEmailConfirmation: true };
  }

  return { ok: true, requiresEmailConfirmation: false };
}

export type SignInWithOAuthResult = OAuthPopupResult;

export async function signInWithOAuthProvider(
  provider: Provider,
  redirectPath: string = WORKSPACE_DASHBOARD_PATH,
): Promise<SignInWithOAuthResult> {
  const redirectTo = isDesktopApp()
    ? buildDesktopOAuthBridgeUrl(redirectPath)
    : (() => {
        const callbackUrl = new URL(`${window.location.origin}${OAUTH_CALLBACK_PATH}`);
        callbackUrl.searchParams.set("next", redirectPath);
        return callbackUrl.toString();
      })();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { ok: false, error };
  }

  if (!data.url) {
    return {
      ok: false,
      error: {
        message: "Could not start Google sign-in.",
        name: "OAuthError",
        status: 400,
      } as AuthError,
    };
  }

  if (isDesktopApp()) {
    return openDesktopOAuth(data.url);
  }

  return openOAuthPopup(data.url);
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
      emailRedirectTo: `${window.location.origin}${WORKSPACE_SETTINGS_PATH}?email-change=pending`,
    },
  );
  return { user: data.user ?? null, error };
}

export async function requestPasswordReset(
  email: string,
  redirectPath: string = `${WORKSPACE_AUTH_PATH}?form-type=reset-password`,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}${redirectPath}`,
  });
  return error;
}
