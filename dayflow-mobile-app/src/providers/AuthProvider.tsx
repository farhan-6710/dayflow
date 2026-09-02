"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@lib/supabase";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@redux/store";
import {
  resetReminders,
  getRemindersRequest,
} from "@redux/slices/remindersSlice";
import { setSessionExpiredCallback } from "@/lib/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  // Reset function to clear Redux store and AsyncStorage
  const resetStore = useCallback(async () => {
    dispatch(resetReminders());
    await AsyncStorage.removeItem("persist:root");
  }, [dispatch]);

  useEffect(() => {
    // Set up session expiration handler
    const handleSessionExpired = async () => {
      try {
        await supabase.auth.signOut();
        await resetStore();
        setSession(null);
        setUser(null);
      } catch (error) {
        console.error("Error during auto sign out:", error);
      }
    };

    setSessionExpiredCallback(handleSessionExpired);

    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Fetch reminders if user is already logged in
      if (session) {
        dispatch(getRemindersRequest());
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        // Clear local data on sign out
        if (event === "SIGNED_OUT") {
          await resetStore();
        }

        // Fetch reminders after successful sign in
        if (event === "SIGNED_IN" && session) {
          dispatch(getRemindersRequest());
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [resetStore, dispatch]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return data.user;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;

    return data.user;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear local data after successful sign out
    await resetStore();
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
