import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import {
  AuthContext,
  type AuthContextValue,
} from "@/features/admin/auth/providers/authContext";
import type { Profile } from "@/services/profilesService";
import {
  onAuthChange,
  refreshCurrentUser,
  signInWithEmail,
  signInWithOAuthProvider,
  signOut,
  signUpWithEmail,
  syncAuthUserMetadata,
} from "@/services/authService";
import { fetchProfile } from "@/services/profilesService";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const loadProfile = useCallback(async (currentUser: User) => {
    try {
      const nextProfile = await fetchProfile(currentUser.id);
      setProfile(nextProfile);
    } catch (e) {
      console.error("Error loading profile:", e);
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
        setIsPasswordRecovery(false);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Token refresh does not change identity — avoid re-sync loops.
      if (event === "TOKEN_REFRESHED") {
        setLoading(false);
        return;
      }

      if (!nextUser) {
        if (event === "INITIAL_SESSION" && active) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      void (async () => {
        const syncedUser = await syncAuthUserMetadata(nextUser);
        if (!active) {
          return;
        }

        setUser((current) => {
          if (
            current?.id === syncedUser.id &&
            current.email === syncedUser.email &&
            current.updated_at === syncedUser.updated_at
          ) {
            return current;
          }
          return syncedUser;
        });

        await loadProfile(syncedUser);
        setLoading(false);
      })();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [loadProfile]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
    setProfile(null);
    setIsPasswordRecovery(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      profile,
      loading,
      isPasswordRecovery,
      clearPasswordRecovery,
      refreshProfile,
      refreshUser,
      signInWithEmail,
      signUpWithEmail,
      signInWithOAuthProvider: (provider, options) =>
        signInWithOAuthProvider(provider, options?.redirectPath),
      signOut: handleSignOut,
    };
  }, [
    user,
    profile,
    loading,
    isPasswordRecovery,
    clearPasswordRecovery,
    refreshProfile,
    refreshUser,
    handleSignOut,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
