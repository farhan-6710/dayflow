import { Navigate, Outlet, useSearchParams } from "react-router";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { AUTH_FORM_TYPES } from "@/features/workspace/auth/constants/auth";
import { DASHBOARD_HOME } from "@/features/workspace/auth/constants/routes";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function PublicRoute() {
  const { loading, user, isPasswordRecovery } = useAuth();
  const [searchParams] = useSearchParams();
  const isResetPasswordForm =
    searchParams.get("form-type") === AUTH_FORM_TYPES.resetPassword;

  if (loading) {
    return <CenteredLoading />;
  }

  // Recovery sessions are authenticated — stay on /auth so the user can set a password.
  if (user && !isPasswordRecovery && !isResetPasswordForm) {
    return <Navigate to={DASHBOARD_HOME} replace />;
  }

  return <Outlet />;
}
