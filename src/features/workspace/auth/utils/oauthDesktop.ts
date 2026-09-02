import type { AuthError } from "@supabase/supabase-js";
import { openUrl } from "@tauri-apps/plugin-opener";

import {
  DESKTOP_OAUTH_CALLBACK_SCHEME,
} from "@/app/constants/oauthRoutes";
import type { OAuthPopupResult } from "@/features/workspace/auth/utils/oauthPopup";
import { supabase } from "@/services/supabaseClient";

const DESKTOP_OAUTH_TIMEOUT_MS = 5 * 60 * 1000;

let pendingResolve: ((result: OAuthPopupResult) => void) | null = null;
let pendingTimeout: ReturnType<typeof setTimeout> | null = null;

function clearDesktopOAuthWait() {
  if (pendingTimeout) {
    clearTimeout(pendingTimeout);
    pendingTimeout = null;
  }
  pendingResolve = null;
}

function finishDesktopOAuth(result: OAuthPopupResult) {
  if (!pendingResolve) {
    return;
  }
  const resolve = pendingResolve;
  clearDesktopOAuthWait();
  resolve(result);
}

/** Opens Google OAuth in the system browser and waits for the deep-link callback. */
export async function openDesktopOAuth(oauthUrl: string): Promise<OAuthPopupResult> {
  return new Promise((resolve) => {
    clearDesktopOAuthWait();
    pendingResolve = resolve;

    pendingTimeout = setTimeout(() => {
      finishDesktopOAuth({ ok: false, error: null, cancelled: true });
    }, DESKTOP_OAUTH_TIMEOUT_MS);

    void openUrl(oauthUrl).catch(() => {
      finishDesktopOAuth({
        ok: false,
        error: {
          message: "Could not open your browser for Google sign-in.",
          name: "OAuthError",
          status: 400,
        } as AuthError,
      });
    });
  });
}

function authErrorFromMessage(message: string): AuthError {
  return { message, name: "OAuthError", status: 400 } as AuthError;
}

/** Handles `dayflow://auth/callback?...` from the Tauri deep-link plugin. */
export async function handleDesktopOAuthCallback(rawUrl: string): Promise<void> {
  if (!rawUrl.startsWith(DESKTOP_OAUTH_CALLBACK_SCHEME)) {
    return;
  }

  const parsed = new URL(rawUrl);
  const oauthError =
    parsed.searchParams.get("error_description") ?? parsed.searchParams.get("error");

  if (oauthError) {
    finishDesktopOAuth({ ok: false, error: authErrorFromMessage(oauthError) });
    return;
  }

  const code = parsed.searchParams.get("code");
  if (!code) {
    finishDesktopOAuth({
      ok: false,
      error: authErrorFromMessage("Missing OAuth code in callback."),
    });
    return;
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    finishDesktopOAuth({ ok: false, error });
    return;
  }

  finishDesktopOAuth({ ok: true });
}

export function buildDesktopOAuthBridgeUrl(nextPath: string): string {
  const origin =
    import.meta.env.VITE_APP_ORIGIN ?? "https://bisque-gull-237581.hostingersite.com";
  const url = new URL("/auth/desktop-oauth-bridge", origin);
  url.searchParams.set("next", nextPath);
  return url.toString();
}
