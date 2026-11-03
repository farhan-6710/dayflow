import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";

import { DESKTOP_OAUTH_CALLBACK_SCHEME } from "@/app/constants/oauthRoutes";
import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { Button } from "@/shared/ui/button";

/**
 * Hosted in the system browser after Supabase OAuth.
 * Forwards the PKCE code to the installed DayFlow desktop app via deep link.
 */
export function DesktopOAuthBridgePage() {
  const [searchParams] = useSearchParams();
  const oauthError =
    searchParams.get("error_description") ?? searchParams.get("error");

  const openDesktopApp = useCallback(() => {
    window.location.href = `${DESKTOP_OAUTH_CALLBACK_SCHEME}${window.location.search}`;
  }, []);

  useEffect(() => {
    if (!oauthError) {
      openDesktopApp();
    }
  }, [oauthError, openDesktopApp]);

  if (oauthError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="text-3xl">Sign-in failed</h1>
        <p className="max-w-md text-sm text-muted-foreground">{oauthError}</p>
        <p className="text-sm text-muted-foreground">
          {`Close this tab and try again in ${BRAND_NAME}.`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-3xl">{`Return to ${BRAND_NAME}`}</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {`Complete sign-in by opening the ${BRAND_NAME} desktop app. If macOS asks for permission, choose Open.`}
      </p>
      <Button type="button" onClick={openDesktopApp}>
        {`Open ${BRAND_NAME}`}
      </Button>
      <p className="text-xs text-muted-foreground">You can close this browser tab afterward.</p>
    </div>
  );
}
