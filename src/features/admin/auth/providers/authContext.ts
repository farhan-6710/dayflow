import { createContext } from "react";
import type { AuthError, User } from "@supabase/supabase-js";
import type { Provider } from "@supabase/supabase-js";
import type { Profile } from "@/services/profilesService";
import type { SignUpWithEmailResult } from "@/services/authService";

export type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  /** True after the user opens a password-reset email link. */
  isPasswordRecovery: boolean;
  clearPasswordRecovery: () => void;
  refreshProfile: () => Promise<void>;
  /** Re-fetch auth user from the server (email / new_email). */
  refreshUser: () => Promise<User | null>;
  signInWithEmail: (email: string, password: string) => Promise<AuthError | null>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string,
    emailRedirectPath?: string,
  ) => Promise<SignUpWithEmailResult>;
  signInWithOAuthProvider: (
    provider: Provider,
    options?: { redirectPath?: string },
  ) => Promise<AuthError | null>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
