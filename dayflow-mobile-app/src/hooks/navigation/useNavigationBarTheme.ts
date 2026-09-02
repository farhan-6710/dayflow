import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

/**
 * Custom hook to set Android navigation bar theme based on color scheme
 * Automatically updates when the color scheme changes
 */
export const useNavigationBarTheme = () => {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS === "android") {
      const setNavigationBarTheme = async () => {
        try {
          await NavigationBar.setBackgroundColorAsync(
            colorScheme === "dark" ? "#1f2937" : "#f3f4f6"
          );
          await NavigationBar.setButtonStyleAsync(
            colorScheme === "dark" ? "light" : "dark"
          );
        } catch {
          // Navigation bar theming is unsupported on some Android builds.
        }
      };
      setNavigationBarTheme();
    }
  }, [colorScheme]);
};
