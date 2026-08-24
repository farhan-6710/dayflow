import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function ProtectedRoute() {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <CenteredLoading />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
