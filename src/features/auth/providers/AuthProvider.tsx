import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import {
  AuthContext,
  type AuthContextValue,
} from "@/features/auth/providers/authContext";
import type { Profile } from "@/services/profilesService";
import {
  getCurrentUser,
  onAuthChange,
  signInWithEmail,
  signInWithOAuthProvider,
  signOut,
  signUpWithEmail,
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

  const clearPasswordRecovery = useCallback(() => {
    setIsPasswordRecovery(false);
  }, []);

  useEffect(() => {
    let active = true;

    // 1. Load the current session once on startup.
    void getCurrentUser().then(async (currentUser) => {
      if (!active) {
        return;
      }
      setUser(currentUser);
      if (currentUser) {
        await loadProfile(currentUser);
      }
      setLoading(false);
    });

    // 2. React to later sign in / sign out / password recovery.
    const unsubscribe = onAuthChange((nextUser, event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
      }
      if (event === "SIGNED_OUT") {
        setIsPasswordRecovery(false);
      }

      setUser(nextUser);
      if (nextUser) {
        void loadProfile(nextUser);
      } else {
        setProfile(null);
      }
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
      signInWithEmail,
      signUpWithEmail,
      signInWithOAuthProvider: (provider, options) =>
        signInWithOAuthProvider(provider, options?.isSignup ?? false),
      signOut: handleSignOut,
    };
  }, [
    user,
    profile,
    loading,
    isPasswordRecovery,
    clearPasswordRecovery,
    refreshProfile,
    handleSignOut,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
