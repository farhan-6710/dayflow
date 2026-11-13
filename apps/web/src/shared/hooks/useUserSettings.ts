import { useContext } from "react";

import { UserSettingsContext, type UserSettingsContextValue } from "@/shared/providers/userSettingsContext";

export function useUserSettings(): UserSettingsContextValue {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error("useUserSettings must be used within UserSettingsProvider");
  }
  return context;
}
