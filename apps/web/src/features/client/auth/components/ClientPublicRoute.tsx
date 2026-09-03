import { Navigate, Outlet, useSearchParams } from "react-router";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { AUTH_FORM_TYPES } from "@/features/workspace/auth/constants/auth";
import { CLIENT_DASHBOARD_HOME } from "@/features/client/constants/routes";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function ClientPublicRoute() {
  const { loading, user, isPasswordRecovery } = useAuth();
  const [searchParams] = useSearchParams();
  const isResetPasswordForm =
    searchParams.get("form-type") === AUTH_FORM_TYPES.resetPassword;

  if (loading) {
    return <CenteredLoading />;
  }

  if (user && !isPasswordRecovery && !isResetPasswordForm) {
    return <Navigate to={CLIENT_DASHBOARD_HOME} replace />;
  }

  return <Outlet />;
}
