import { Navigate, Outlet, useLocation, useSearchParams } from "react-router";

import { CLIENT_PORTAL_DASHBOARD_PATH } from "@/app/constants/clientPortalRoutes";
import { CenteredLoading } from "@/shared/components/CenteredLoading";
import { AUTH_FORM_TYPE_PARAM, AUTH_FORM_TYPES } from "@/shared/constants/auth";
import { useAuth } from "@/shared/hooks/useAuth";
import { requestedPath } from "@/shared/utils/authUrlParams";

export function ClientPublicRoute() {
  const { loading, user, isPasswordRecovery } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isResetPasswordForm =
    searchParams.get(AUTH_FORM_TYPE_PARAM) === AUTH_FORM_TYPES.resetPassword;

  if (loading) {
    return <CenteredLoading />;
  }

  if (user && !isPasswordRecovery && !isResetPasswordForm) {
    return <Navigate to={requestedPath(location.state, CLIENT_PORTAL_DASHBOARD_PATH)} replace />;
  }

  return <Outlet />;
}
