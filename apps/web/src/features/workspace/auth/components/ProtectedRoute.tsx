import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { AUTH_FORM_TYPES } from "@/features/workspace/auth/constants/auth";
import { AUTH_HOME } from "@/features/workspace/auth/constants/routes";
import { buildAuthUrl } from "@/features/workspace/auth/utils/authUrlParams";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function ProtectedRoute() {
  const { loading, user, isPasswordRecovery } = useAuth();
  const location = useLocation();

  if (loading) {
    return <CenteredLoading />;
  }

  if (isPasswordRecovery) {
    return (
      <Navigate to={buildAuthUrl(AUTH_FORM_TYPES.resetPassword)} replace />
    );
  }

  if (!user) {
    return <Navigate to={AUTH_HOME} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
