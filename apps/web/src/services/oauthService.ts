import type { Provider } from "@supabase/supabase-js";

import { OAUTH_CALLBACK_MESSAGE_TYPE, OAUTH_CALLBACK_PATH } from "@/app/constants/oauthRoutes";
import { getCurrentSession, onAuthChange } from "@/services/authService";
import { supabase } from "@/services/supabaseClient";

export type OAuthPopupResult =
  | { ok: true }
  | { ok: false; message?: string; cancelled?: boolean; popupBlocked?: boolean };

const POPUP_NAME = "dayflow-oauth";
const POPUP_FEATURES = "popup=yes,width=500,height=700,left=100,top=80,scrollbars=yes,resizable=yes";

type OAuthCallbackMessage = {
  type: typeof OAUTH_CALLBACK_MESSAGE_TYPE;
  success: boolean;
  error?: string;
};

function openOAuthPopup(oauthUrl: string): Promise<OAuthPopupResult> {
  return new Promise((resolve) => {
    const popup = window.open(oauthUrl, POPUP_NAME, POPUP_FEATURES);
    if (!popup) {
      resolve({ ok: false, popupBlocked: true });
      return;
    }

    let settled = false;

    const finish = (result: OAuthPopupResult) => {
      if (settled) {
        return;
      }
      settled = true;
      window.removeEventListener("message", onMessage);
      window.clearInterval(closedPoll);
      unsubscribe();
      if (!popup.closed) {
        popup.close();
      }
      resolve(result);
    };

    const onMessage = (event: MessageEvent<OAuthCallbackMessage>) => {
      if (event.origin === window.location.origin && event.data?.type === OAUTH_CALLBACK_MESSAGE_TYPE) {
        finish(event.data.success ? { ok: true } : { ok: false, message: event.data.error });
      }
    };

    const closedPoll = window.setInterval(() => {
      if (popup.closed) {
        void getCurrentSession()
          .then((session) => finish(session ? { ok: true } : { ok: false, cancelled: true }))
          .catch(() => finish({ ok: false, cancelled: true }));
      }
    }, 400);

    const unsubscribe = onAuthChange((user, event) => {
      if (event === "SIGNED_IN" && user) {
        finish({ ok: true });
      }
    });

    window.addEventListener("message", onMessage);
  });
}

export async function signInWithOAuthProvider(
  provider: Provider,
  redirectPath: string,
): Promise<OAuthPopupResult> {
  const callbackUrl = new URL(OAUTH_CALLBACK_PATH, window.location.origin);
  callbackUrl.searchParams.set("next", redirectPath);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl.toString(),
      skipBrowserRedirect: true,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error || !data.url) {
    return { ok: false, message: error?.message };
  }
  return openOAuthPopup(data.url);
}
