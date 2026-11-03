import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import {
  onAuthChange,
  refreshCurrentUser,
  signOut,
  syncAuthUserMetadata,
} from "@/services/authService";
import { fetchProfile } from "@/services/profilesService";
import { AuthContext, type AuthContextValue } from "@/shared/providers/authContext";
import type { Profile } from "@/shared/types/types";
import { isPasswordRecoveryUrl } from "@/shared/utils/passwordRecovery";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(isPasswordRecoveryUrl);

  const loadProfile = useCallback(async (currentUser: User) => {
    try {
      setProfile(await fetchProfile(currentUser.id));
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user);
    }
  }, [user, loadProfile]);

  const refreshUser = useCallback(async () => {
    const nextUser = await refreshCurrentUser();
    setUser(nextUser);
    if (nextUser) {
      await loadProfile(nextUser);
    } else {
      setProfile(null);
    }
    return nextUser;
  }, [loadProfile]);

  const clearPasswordRecovery = useCallback(() => {
    setIsPasswordRecovery(false);
  }, []);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthChange((nextUser, event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
      }

      if (event === "SIGNED_OUT") {
        clearPasswordRecovery();
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Token refresh does not change identity: avoid re-sync loops.
      if (event === "TOKEN_REFRESHED") {
        setLoading(false);
        return;
      }

      if (!nextUser) {
        if (event === "INITIAL_SESSION") {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      void (async () => {
        // Don't call updateUser during recovery: it can consume the session
        // before the user has set a new password.
        const syncedUser =
          event === "PASSWORD_RECOVERY" ? nextUser : await syncAuthUserMetadata(nextUser);
        if (!active) {
          return;
        }

        setUser((current) =>
          current?.id === syncedUser.id &&
          current.email === syncedUser.email &&
          current.updated_at === syncedUser.updated_at
            ? current
            : syncedUser,
        );

        await loadProfile(syncedUser);
        setLoading(false);
      })();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [clearPasswordRecovery, loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      isPasswordRecovery,
      clearPasswordRecovery,
      refreshProfile,
      refreshUser,
      signOut,
    }),
    [user, profile, loading, isPasswordRecovery, clearPasswordRecovery, refreshProfile, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
