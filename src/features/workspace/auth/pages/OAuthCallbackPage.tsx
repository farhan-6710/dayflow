import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";

import {
  OAUTH_CALLBACK_MESSAGE_TYPE,
} from "@/app/constants/oauthRoutes";
import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";
import { supabase } from "@/services/supabaseClient";

function notifyOpener(success: boolean, errorMessage?: string) {
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage(
      {
        type: OAUTH_CALLBACK_MESSAGE_TYPE,
        success,
        error: errorMessage,
      },
      window.location.origin,
    );
    window.close();
    return true;
  }

  return false;
}

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handledRef = useRef(false);

  const nextPath = searchParams.get("next") ?? WORKSPACE_DASHBOARD_PATH;
  const oauthError =
    searchParams.get("error_description") ?? searchParams.get("error");

  useEffect(() => {
    if (handledRef.current) {
      return;
    }

    if (oauthError) {
      handledRef.current = true;
      if (!notifyOpener(false, oauthError)) {
        navigate(nextPath, { replace: true });
      }
      return;
    }

    const code = searchParams.get("code");
    let active = true;

    const complete = (success: boolean, errorMessage?: string) => {
      if (!active || handledRef.current) {
        return;
      }
      handledRef.current = true;

      if (notifyOpener(success, errorMessage)) {
        return;
      }

      navigate(nextPath, { replace: true });
    };

    const finishWithSession = () => {
      void supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (!active) {
          return;
        }
        if (error) {
          complete(false, error.message);
          return;
        }
        if (session) {
          complete(true);
        }
      });
    };

    if (code) {
      void supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!active) {
          return;
        }
        if (error) {
          complete(false, error.message);
          return;
        }
        finishWithSession();
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        complete(true);
      }
    });

    if (!code) {
      finishWithSession();
    }

    const timeout = window.setTimeout(() => {
      if (!handledRef.current) {
        complete(false, "Sign-in timed out. Please try again.");
      }
    }, 30_000);

    return () => {
      active = false;
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [navigate, nextPath, oauthError, searchParams]);

  return <CenteredLoading />;
}
