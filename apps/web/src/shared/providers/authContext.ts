import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

import type { Profile } from "@/shared/types/types";

export type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isPasswordRecovery: boolean;
  clearPasswordRecovery: () => void;
  refreshProfile: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
