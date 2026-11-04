import { useCallback, useState } from "react";

import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_PREFERENCES_STORAGE_KEY,
  type NotificationPreferences,
} from "@/shared/settings/constants/notificationPreferences";
import { showToast } from "@/shared/utils/showToast";

function readPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(NOTIFICATION_PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_PREFERENCES;
    return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
}

export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState(readPreferences);

  const setPreference = useCallback(
    <K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) => {
      setPreferences((current) => {
        const next = { ...current, [key]: value };
        localStorage.setItem(NOTIFICATION_PREFERENCES_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      showToast("success", "Preference saved in this browser.");
    },
    [],
  );

  return { preferences, setPreference };
}
