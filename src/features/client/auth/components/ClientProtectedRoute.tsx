import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";

import { useAuth } from "@/features/admin/auth/hooks/useAuth";
import {
  CLIENT_PORTAL_AUTH_PATH,
  CLIENT_PORTAL_NOT_A_CLIENT_PATH,
} from "@/app/constants/clientPortalRoutes";
import { ClientPortalProvider } from "@/features/client/providers/ClientPortalProvider";
import type { Client } from "@/features/admin/clients-management/types/types";
import {
  fetchClientForAuthUser,
  linkClientPortalUser,
} from "@/services/clientPortalService";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function ClientProtectedRoute() {
  const { loading, user } = useAuth();
  const location = useLocation();
  const [client, setClient] = useState<Client | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      setChecking(false);
      setClient(null);
      return;
    }

    let active = true;
    void (async () => {
      try {
        setChecking(true);
        let linked = await fetchClientForAuthUser(user.id);
        if (!linked && user.email) {
          linked = await linkClientPortalUser(user.id, user.email);
        }
        if (active) {
          setClient(linked);
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, user]);

  if (loading || checking) {
    return <CenteredLoading />;
  }

  if (!user) {
    return <Navigate to={CLIENT_PORTAL_AUTH_PATH} state={{ from: location }} replace />;
  }

  if (!client) {
    return <Navigate to={CLIENT_PORTAL_NOT_A_CLIENT_PATH} replace />;
  }

  return (
    <ClientPortalProvider client={client}>
      <Outlet />
    </ClientPortalProvider>
  );
}
