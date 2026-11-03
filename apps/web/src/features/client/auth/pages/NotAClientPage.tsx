import { Loader2 } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router";

import { CLIENT_PORTAL_AUTH_PATH } from "@/app/constants/clientPortalRoutes";
import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { useNotAClient } from "@/features/client/hooks/useNotAClient";
import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { CenteredLoading } from "@/shared/components/CenteredLoading";
import { DayflowImage } from "@/shared/components/DayflowImage";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/ui/button";

export function NotAClientPage() {
  const { user, loading } = useAuth();
  const { state } = useLocation();
  const { retrying, retryMessage, retry, handleSignOut } = useNotAClient();
  const linkError = (state as { linkError?: string | null } | null)?.linkError;
  const message = retryMessage ?? linkError;

  if (loading) {
    return <CenteredLoading />;
  }
  if (!user) {
    return <Navigate to={CLIENT_PORTAL_AUTH_PATH} replace />;
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-5 px-4 py-8 text-center">
      <DayflowImage name="illo-not-a-client" className="w-52 max-w-full" />
      <div className="space-y-2">
        <h1 className="text-3xl text-balance">This account isn't linked to a client</h1>
        <p className="text-muted-foreground text-pretty">
          No active client profile matches {user.email}. Ask your provider to add you with this
          email, or open the workspace if you run your own {BRAND_NAME} account.
        </p>
      </div>
      {message ? (
        <div className="w-full text-left">
          <ErrorBanner message={message} />
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="lg" disabled={retrying} onClick={() => void retry()}>
          {retrying ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          Try linking again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to={WORKSPACE_DASHBOARD_PATH}>Open workspace</Link>
        </Button>
        <Button size="lg" variant="ghost" onClick={() => void handleSignOut()}>
          Sign out
        </Button>
      </div>
    </main>
  );
}
