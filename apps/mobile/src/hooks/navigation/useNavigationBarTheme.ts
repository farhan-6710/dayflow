import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { NavigationBar } from "expo-navigation-bar";

/**
 * Android system navigation bar button style follows the app color scheme.
 * Background color is OS-managed under edge-to-edge (SDK 57+).
 */
export const useNavigationBarTheme = () => {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    try {
      // light scheme → dark buttons; dark scheme → light buttons
      NavigationBar.setStyle(colorScheme === "dark" ? "light" : "dark");
    } catch {
      // Navigation bar theming is unsupported on some Android builds.
    }
  }, [colorScheme]);
};
