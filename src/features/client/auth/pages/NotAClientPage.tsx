import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { ADMIN_PORTAL_AUTH_PATH } from "@/app/constants/adminPortalRoutes";
import { CLIENT_PORTAL_DASHBOARD_PATH } from "@/app/constants/clientPortalRoutes";
import { CLIENT_AUTH_HOME } from "@/features/client/constants/routes";
import { useAuth } from "@/features/admin/auth/hooks/useAuth";
import { resolveClientPortalProfile } from "@/services/clientPortalService";
import { Button } from "@/shared/ui/button";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";

export function NotAClientPage() {
  const { refreshUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const linkError =
    (location.state as { linkError?: string } | null)?.linkError ?? null;
  const [retrying, setRetrying] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  async function handleRetry() {
    setRetrying(true);
    setRetryMessage(null);
    try {
      await refreshUser();
      const linked = await resolveClientPortalProfile();
      if (linked) {
        navigate(CLIENT_PORTAL_DASHBOARD_PATH, { replace: true });
        return;
      }
      setRetryMessage(
        "Still no match. Confirm the client row email matches your login email exactly.",
      );
    } catch (err) {
      setRetryMessage(
        err instanceof Error ? err.message : "Could not link your client profile.",
      );
    } finally {
      setRetrying(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate(CLIENT_AUTH_HOME, { replace: true });
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">
          You are not registered as a client
        </h1>
        <p className="text-sm text-muted-foreground">
          No active client profile matches this account&apos;s email. Ask your
          provider to add you in Clients Management with the same email you use
          to sign in, or use the admin portal if you are a team member.
        </p>
        {linkError ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {linkError}
          </p>
        ) : null}
        {retryMessage ? (
          <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            {retryMessage}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            variant="default"
            disabled={retrying}
            onClick={() => void handleRetry()}
          >
            {retrying ? (
              <>
                <LoadingSpinner size="sm" />
                Linking...
              </>
            ) : (
              "Try linking again"
            )}
          </Button>
          <Button asChild variant="outline">
            <Link to={CLIENT_AUTH_HOME}>Back to client login</Link>
          </Button>
          <Button type="button" variant="outline" onClick={() => void handleSignOut()}>
            Sign out
          </Button>
          <Button asChild>
            <Link to={ADMIN_PORTAL_AUTH_PATH}>Go to admin portal</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
