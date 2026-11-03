import { useState } from "react";
import { useNavigate } from "react-router";

import { CLIENT_PORTAL_AUTH_PATH, CLIENT_PORTAL_DASHBOARD_PATH } from "@/app/constants/clientPortalRoutes";
import { resolveClientPortalProfile } from "@/services/clientPortalService";
import { useAuth } from "@/shared/hooks/useAuth";
import { showToast } from "@/shared/utils/showToast";

export function useNotAClient() {
  const { refreshUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [retrying, setRetrying] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  async function retry() {
    setRetrying(true);
    setRetryMessage(null);
    try {
      await refreshUser();
      if (await resolveClientPortalProfile()) {
        void navigate(CLIENT_PORTAL_DASHBOARD_PATH, { replace: true });
        return;
      }
      setRetryMessage("Still no match. Ask your provider to check that your client email matches your login email exactly.");
    } catch (error) {
      console.error("Client link retry failed:", error);
      setRetryMessage("Couldn't check your client profile. Check your connection and try again.");
    } finally {
      setRetrying(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      void navigate(CLIENT_PORTAL_AUTH_PATH, { replace: true });
    } catch (error) {
      console.error("Sign out failed:", error);
      showToast("error", "Couldn't sign you out. Check your connection and try again.");
    }
  }

  return { retrying, retryMessage, retry, handleSignOut };
}
