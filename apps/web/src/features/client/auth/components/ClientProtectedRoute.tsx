import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { AUTH_FORM_TYPES } from "@/features/workspace/auth/constants/auth";
import { buildClientAuthUrl } from "@/features/client/auth/utils/clientAuthUrlParams";
import {
  CLIENT_PORTAL_AUTH_PATH,
  CLIENT_PORTAL_NOT_A_CLIENT_PATH,
} from "@/app/constants/clientPortalRoutes";
import { ClientPortalProvider } from "@/features/client/providers/ClientPortalProvider";
import type { Client } from "@/features/workspace/clients-management/types/types";
import { resolveClientPortalProfile } from "@/services/clientPortalService";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function ClientProtectedRoute() {
  const { loading, user, isPasswordRecovery } = useAuth();
  const location = useLocation();
  const userId = user?.id ?? null;
  const [client, setClient] = useState<Client | null>(null);
  const [checking, setChecking] = useState(true);
  const [linkError, setLinkError] = useState<string | null>(null);
  const resolvedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading || isPasswordRecovery) {
      return;
    }

    if (!userId) {
      resolvedUserIdRef.current = null;
      setClient(null);
      setLinkError(null);
      setChecking(false);
      return;
    }

    if (resolvedUserIdRef.current === userId && client) {
      setChecking(false);
      return;
    }

    let active = true;
    void (async () => {
      setChecking(true);
      setLinkError(null);

      try {
        const linked = await resolveClientPortalProfile();
        if (!active) {
          return;
        }

        setClient(linked);
        if (linked) {
          resolvedUserIdRef.current = userId;
        }
      } catch (err) {
        console.error("Failed to resolve client portal profile:", err);
        if (active) {
          setClient(null);
          setLinkError(
            err instanceof Error
              ? err.message
              : "Failed to link client profile.",
          );
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
  }, [loading, userId, isPasswordRecovery]);

  if (loading) {
    return <CenteredLoading />;
  }

  if (isPasswordRecovery) {
    return (
      <Navigate
        to={buildClientAuthUrl(AUTH_FORM_TYPES.resetPassword)}
        replace
      />
    );
  }

  if (checking) {
    return <CenteredLoading />;
  }

  if (!user) {
    return (
      <Navigate
        to={CLIENT_PORTAL_AUTH_PATH}
        state={{ from: location }}
        replace
      />
    );
  }

  if (!client) {
    return (
      <Navigate
        to={CLIENT_PORTAL_NOT_A_CLIENT_PATH}
        replace
        state={{ linkError }}
      />
    );
  }

  return (
    <ClientPortalProvider client={client}>
      <Outlet />
    </ClientPortalProvider>
  );
}
