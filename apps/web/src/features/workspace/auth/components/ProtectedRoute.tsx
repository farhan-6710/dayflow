import { Navigate, Outlet, useLocation } from "react-router";

import { WORKSPACE_AUTH_PATH } from "@/app/constants/workspaceRoutes";
import { CenteredLoading } from "@/shared/components/CenteredLoading";
import { AUTH_FORM_TYPES } from "@/shared/constants/auth";
import { useAuth } from "@/shared/hooks/useAuth";
import { buildAuthUrl } from "@/shared/utils/authUrlParams";

export function ProtectedRoute() {
  const { loading, user, isPasswordRecovery } = useAuth();
  const location = useLocation();

  if (loading) {
    return <CenteredLoading />;
  }

  if (isPasswordRecovery) {
    return <Navigate to={buildAuthUrl(WORKSPACE_AUTH_PATH, AUTH_FORM_TYPES.resetPassword)} replace />;
  }

  if (!user) {
    return <Navigate to={WORKSPACE_AUTH_PATH} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
