import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { CLIENT_DASHBOARD_HOME } from "@/features/client/constants/routes";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function ClientPublicRoute() {
  const { loading, user } = useAuth();

  if (loading) {
    return <CenteredLoading />;
  }

  if (user) {
    return <Navigate to={CLIENT_DASHBOARD_HOME} replace />;
  }

  return <Outlet />;
}
