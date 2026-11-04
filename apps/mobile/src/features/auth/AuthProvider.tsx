import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { clearReminderSchedule } from "@/features/reminders/notificationPort";
import { getCurrentSession, onAuthChange, signOut as signOutService } from "@/services/authService";
import { resolveClientPortalProfile } from "@/services/clientPortalService";
import { fetchProfile } from "@/services/profilesService";
import type { Client, Profile } from "@/shared/types/types";
import { getAvatarUrl, getDisplayName, getInitials } from "@/shared/utils/authUserDisplay";

export type Portal = "workspace" | "client";

const PORTAL_KEY = "dayflow:portal";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  profile: Profile | null;
  displayName: string;
  firstName: string;
  initials: string;
  avatarUrl: string | null;
  portal: Portal;
  setPortal: (portal: Portal) => void;
  /** The client record linked to this login, for the client portal. */
  client: Client | null;
  clientLoading: boolean;
  clientError: boolean;
  recheckClient: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [portal, setPortalState] = useState<Portal>("workspace");
  const [portalLoading, setPortalLoading] = useState(true);

  useEffect(() => {
    void AsyncStorage.getItem(PORTAL_KEY)
      .then((saved) => {
        if (saved === "client" || saved === "workspace") setPortalState(saved);
      })
      .finally(() => setPortalLoading(false));

    void getCurrentSession()
      .then((session) => setUser(session?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setSessionLoading(false));

    return onAuthChange((nextUser) => setUser(nextUser));
  }, []);

  const setPortal = useCallback((next: Portal) => {
    setPortalState(next);
    void AsyncStorage.setItem(PORTAL_KEY, next);
  }, []);

  const userId = user?.id;
  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId as string),
    enabled: Boolean(userId),
  });

  const clientQuery = useQuery({
    queryKey: ["client-link", userId],
    queryFn: resolveClientPortalProfile,
    enabled: Boolean(userId) && portal === "client",
    retry: false,
  });

  const signOut = useCallback(async () => {
    await signOutService();
    queryClient.clear();
    await clearReminderSchedule();
  }, [queryClient]);

  const recheckClient = useCallback(() => void clientQuery.refetch(), [clientQuery]);

  const value = useMemo<AuthContextValue>(() => {
    const profile = profileQuery.data ?? null;
    const displayName = getDisplayName(user, profile?.display_name);
    return {
      user,
      loading: sessionLoading || portalLoading,
      profile,
      displayName,
      firstName: displayName.split(/\s+/)[0] || displayName,
      initials: getInitials(displayName),
      avatarUrl: getAvatarUrl(user, profile?.avatar_url),
      portal,
      setPortal,
      client: clientQuery.data ?? null,
      clientLoading: clientQuery.isPending && Boolean(userId) && portal === "client",
      clientError: clientQuery.isError,
      recheckClient,
      signOut,
    };
  }, [user, sessionLoading, portalLoading, profileQuery.data, portal, setPortal, clientQuery.data, clientQuery.isPending, clientQuery.isError, userId, recheckClient, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

/** For screens behind a guard, where a user always exists. */
export function useUserId(): string {
  const { user } = useAuth();
  if (!user) throw new Error("useUserId needs a signed-in user");
  return user.id;
}
