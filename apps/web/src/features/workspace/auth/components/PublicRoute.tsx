import { Navigate, Outlet, useSearchParams } from "react-router";

import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { CenteredLoading } from "@/shared/components/CenteredLoading";
import { AUTH_FORM_TYPE_PARAM, AUTH_FORM_TYPES } from "@/shared/constants/auth";
import { useAuth } from "@/shared/hooks/useAuth";

export function PublicRoute() {
  const { loading, user, isPasswordRecovery } = useAuth();
  const [searchParams] = useSearchParams();
  const isResetPasswordForm =
    searchParams.get(AUTH_FORM_TYPE_PARAM) === AUTH_FORM_TYPES.resetPassword;

  if (loading) {
    return <CenteredLoading />;
  }

  // Recovery sessions are authenticated: stay on /auth so the user can set a password.
  if (user && !isPasswordRecovery && !isResetPasswordForm) {
    return <Navigate to={WORKSPACE_DASHBOARD_PATH} replace />;
  }

  return <Outlet />;
}
