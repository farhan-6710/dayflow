import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { DASHBOARD_HOME } from "@/features/workspace/auth/constants/routes";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function PublicRoute() {
  const { loading, user } = useAuth();

  if (loading) {
    return <CenteredLoading />;
  }

  if (user) {
    return <Navigate to={DASHBOARD_HOME} replace />;
  }

  return <Outlet />;
}
