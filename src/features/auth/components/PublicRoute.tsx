import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function PublicRoute() {
  const { loading, user } = useAuth();

  if (loading) {
    return <CenteredLoading />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
