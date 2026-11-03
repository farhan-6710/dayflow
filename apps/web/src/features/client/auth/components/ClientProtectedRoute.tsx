import { Navigate, Outlet, useLocation } from "react-router";

import {
  CLIENT_PORTAL_AUTH_PATH,
  CLIENT_PORTAL_NOT_A_CLIENT_PATH,
} from "@/app/constants/clientPortalRoutes";
import { useClientProfileLink } from "@/features/client/hooks/useClientProfileLink";
import { ClientPortalProvider } from "@/features/client/providers/ClientPortalProvider";
import { CenteredLoading } from "@/shared/components/CenteredLoading";
import { AUTH_FORM_TYPES } from "@/shared/constants/auth";
import { useAuth } from "@/shared/hooks/useAuth";
import { buildAuthUrl } from "@/shared/utils/authUrlParams";

export function ClientProtectedRoute() {
  const { loading, user, isPasswordRecovery } = useAuth();
  const location = useLocation();
  const { client, linkError, checking } = useClientProfileLink(
    user?.id ?? null,
    !loading && !isPasswordRecovery,
  );

  if (loading) {
    return <CenteredLoading />;
  }

  if (isPasswordRecovery) {
    return <Navigate to={buildAuthUrl(CLIENT_PORTAL_AUTH_PATH, AUTH_FORM_TYPES.resetPassword)} replace />;
  }

  if (!user) {
    return <Navigate to={CLIENT_PORTAL_AUTH_PATH} state={{ from: location }} replace />;
  }

  if (checking) {
    return <CenteredLoading />;
  }

  if (!client) {
    return <Navigate to={CLIENT_PORTAL_NOT_A_CLIENT_PATH} state={{ linkError }} replace />;
  }

  return (
    <ClientPortalProvider client={client}>
      <Outlet />
    </ClientPortalProvider>
  );
}
