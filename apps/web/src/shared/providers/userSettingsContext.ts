import { createContext } from "react";

import type { UserSettingKey, UserSettings } from "@/shared/types/types";

export type UserSettingsContextValue = {
  settings: UserSettings;
  /** Set when the saved settings could not be loaded; defaults are shown meanwhile. */
  loadError: string | null;
  saving: UserSettingKey | null;
  setSetting: (key: UserSettingKey, value: boolean) => Promise<void>;
  reload: () => void;
};

export const UserSettingsContext = createContext<UserSettingsContextValue | null>(null);
