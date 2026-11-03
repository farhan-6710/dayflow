import { useCallback } from "react";
import { useTheme } from "next-themes";

import { updateProfile } from "@/services/profilesService";
import { useAuth } from "@/shared/hooks/useAuth";
import { showToast } from "@/shared/utils/showToast";

/** Current theme plus a setter that also saves the choice to the signed-in user's profile. */
export function useThemeMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useAuth();
  const userId = user?.id;
  const isDark = resolvedTheme === "dark";

  const setDarkMode = useCallback(
    async (enabled: boolean) => {
      const theme = enabled ? "dark" : "light";
      setTheme(theme);
      if (!userId) {
        return;
      }
      try {
        await updateProfile(userId, { theme_preference: theme });
      } catch (error) {
        console.error("Failed to save theme preference:", error);
        showToast("error", "Theme changed here, but it couldn't be saved to your profile.");
      }
    },
    [setTheme, userId],
  );

  return { isDark, setDarkMode };
}
