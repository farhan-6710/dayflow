import { Link } from "react-router";

import { ADMIN_PORTAL_AUTH_PATH } from "@/app/constants/adminPortalRoutes";
import { CLIENT_AUTH_HOME } from "@/features/client/constants/routes";
import { Button } from "@/shared/ui/button";

export function NotAClientPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">
          You are not registered as a client
        </h1>
        <p className="text-sm text-muted-foreground">
          This account is not linked to a client profile yet. Ask your provider
          to add you in Clients Management, or sign in to the admin portal
          instead.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button asChild variant="outline">
            <Link to={CLIENT_AUTH_HOME}>Back to client login</Link>
          </Button>
          <Button asChild>
            <Link to={ADMIN_PORTAL_AUTH_PATH}>Go to admin portal</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
