import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { OAUTH_CALLBACK_MESSAGE_TYPE } from "@/app/constants/oauthRoutes";
import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { getCurrentSession } from "@/services/authService";
import { formatAuthErrorMessage } from "@/shared/auth/utils/formatAuthErrorMessage";
import { safeNextPath } from "@/shared/utils/authUrlParams";
import { showToast } from "@/shared/utils/showToast";

type PopupOpener = { closed: boolean; postMessage: (message: unknown, origin: string) => void };

/** Reports to the window that opened this popup. False when opened directly (no opener). */
function notifyOpener(success: boolean, error?: string): boolean {
  const opener = window.opener as PopupOpener | null;
  if (!opener || opener.closed) {
    return false;
  }
  opener.postMessage({ type: OAUTH_CALLBACK_MESSAGE_TYPE, success, error }, window.location.origin);
  window.close();
  return true;
}

/** The Supabase client exchanges the code in the URL by itself; this waits for that, then reports back. */
export function useOAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"), WORKSPACE_DASHBOARD_PATH);
  const oauthError = searchParams.get("error_description") ?? searchParams.get("error");

  useEffect(() => {
    let active = true;

    function finish(success: boolean, error?: string) {
      if (!active || notifyOpener(success, error)) {
        return;
      }
      if (error) {
        showToast("error", formatAuthErrorMessage(error));
      }
      void navigate(nextPath, { replace: true });
    }

    if (oauthError) {
      finish(false, oauthError);
    } else {
      void getCurrentSession()
        .then((session) => finish(Boolean(session), session ? undefined : "Sign-in didn't complete. Please try again."))
        .catch((error: unknown) =>
          finish(false, error instanceof Error ? error.message : "Sign-in failed. Please try again."),
        );
    }

    return () => {
      active = false;
    };
  }, [navigate, nextPath, oauthError]);
}
