import { openUrl } from "@tauri-apps/plugin-opener";

import { DESKTOP_OAUTH_BRIDGE_PATH, DESKTOP_OAUTH_CALLBACK_SCHEME } from "@/app/constants/oauthRoutes";
import type { OAuthPopupResult } from "@/services/oauthService";
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
      finishDesktopOAuth({ ok: false, cancelled: true });
    }, DESKTOP_OAUTH_TIMEOUT_MS);

    void openUrl(oauthUrl).catch(() => {
      finishDesktopOAuth({
        ok: false,
        message: "Could not open your browser for Google sign-in.",
      });
    });
  });
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
    finishDesktopOAuth({ ok: false, message: oauthError });
    return;
  }

  const code = parsed.searchParams.get("code");
  if (!code) {
    finishDesktopOAuth({ ok: false, message: "Missing OAuth code in callback." });
    return;
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    finishDesktopOAuth({ ok: false, message: error.message });
    return;
  }

  finishDesktopOAuth({ ok: true });
}

export function buildDesktopOAuthBridgeUrl(nextPath: string): string {
  const origin =
    import.meta.env.VITE_APP_ORIGIN ?? "https://bisque-gull-237581.hostingersite.com";
  const url = new URL(DESKTOP_OAUTH_BRIDGE_PATH, origin);
  url.searchParams.set("next", nextPath);
  return url.toString();
}
