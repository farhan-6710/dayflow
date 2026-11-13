import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { fetchUserSettings, saveUserSettings } from "@/services/userSettingsService";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserSettingsContext } from "@/shared/providers/userSettingsContext";
import {
  DEFAULT_USER_SETTINGS,
  USER_SETTING_COPY,
  USER_SETTINGS_MIRROR_KEY,
} from "@/shared/settings/constants/userSettings";
import type { UserSettingKey, UserSettings } from "@/shared/types/types";
import { showToast } from "@/shared/utils/showToast";

const LOAD_ERROR = "Couldn't load your saved settings. Showing the defaults.";

function readMirror(): UserSettings {
  try {
    const raw = localStorage.getItem(USER_SETTINGS_MIRROR_KEY);
    return raw ? { ...DEFAULT_USER_SETTINGS, ...(JSON.parse(raw) as Partial<UserSettings>) } : DEFAULT_USER_SETTINGS;
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

function writeMirror(settings: UserSettings) {
  try {
    localStorage.setItem(USER_SETTINGS_MIRROR_KEY, JSON.stringify(settings));
  } catch {
    /* storage blocked: the database copy still holds the choice */
  }
}

/** Loads the signed-in user's `user_settings` row and saves each toggle back to it. */
export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [settings, setSettings] = useState<UserSettings>(readMirror);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState<UserSettingKey | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const settingsRef = useRef(settings);
  useLayoutEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    let cancelled = false;
    fetchUserSettings(userId)
      .then((saved) => {
        if (cancelled) return;
        const next = saved ?? DEFAULT_USER_SETTINGS;
        setSettings(next);
        writeMirror(next);
        setLoadError(null);
      })
      .catch(() => {
        if (!cancelled) setLoadError(LOAD_ERROR);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, reloadToken]);

  const setSetting = useCallback(
    async (key: UserSettingKey, value: boolean) => {
      if (!userId) {
        return;
      }
      const previous = settingsRef.current;
      const next = { ...previous, [key]: value };
      const { label, onDetail, offDetail } = USER_SETTING_COPY[key];
      setSettings(next);
      setSaving(key);
      try {
        const saved = await saveUserSettings(userId, next);
        setSettings(saved);
        writeMirror(saved);
        showToast("success", `${label} turned ${value ? "on" : "off"}`, {
          description: value ? onDetail : offDetail,
        });
      } catch {
        setSettings(previous);
        showToast("error", `Couldn't update ${label.toLowerCase()}`, {
          description: "Your change wasn't saved. Check your connection and try again.",
        });
      } finally {
        setSaving(null);
      }
    },
    [userId],
  );

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  const value = useMemo(
    () => ({ settings, loadError, saving, setSetting, reload }),
    [settings, loadError, saving, setSetting, reload],
  );

  return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
}
