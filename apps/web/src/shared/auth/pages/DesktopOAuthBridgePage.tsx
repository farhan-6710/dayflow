import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { DESKTOP_OAUTH_CALLBACK_SCHEME } from "@/app/constants/oauthRoutes";
import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { Button } from "@/shared/ui/button";

function openDesktopApp() {
  window.location.href = `${DESKTOP_OAUTH_CALLBACK_SCHEME}${window.location.search}`;
}

/**
 * Hosted in the system browser after Supabase OAuth: forwards the code to the
 * installed desktop app. Released desktop builds depend on this page.
 */
export function DesktopOAuthBridgePage() {
  const [searchParams] = useSearchParams();
  const oauthError = searchParams.get("error_description") ?? searchParams.get("error");

  useEffect(() => {
    if (!oauthError) {
      openDesktopApp();
    }
  }, [oauthError]);

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl text-balance">
        {oauthError ? "Sign-in failed" : `Return to ${BRAND_NAME}`}
      </h1>
      <p className="text-muted-foreground text-pretty">
        {oauthError
          ? `${oauthError} Close this tab and try again in ${BRAND_NAME}.`
          : `Finish signing in by opening the ${BRAND_NAME} desktop app. You can close this tab afterwards.`}
      </p>
      {oauthError ? null : (
        <Button size="lg" onClick={openDesktopApp}>
          Open {BRAND_NAME}
        </Button>
      )}
    </main>
  );
}
