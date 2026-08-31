import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/features/admin/auth/hooks/useAuth";
import { AUTH_HOME } from "@/features/admin/auth/constants/routes";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function ProtectedRoute() {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <CenteredLoading />;
  }

  if (!user) {
    return <Navigate to={AUTH_HOME} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
