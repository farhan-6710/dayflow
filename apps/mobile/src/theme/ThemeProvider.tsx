import AsyncStorage from "@react-native-async-storage/async-storage";
import { themeTokens } from "@dayflow/brand/theme";
import { cssInterop, vars } from "nativewind";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Animated, useColorScheme, View } from "react-native";

// Lets Animated.View take class names, as the sheet and skeleton do.
cssInterop(Animated.View, { className: "style" });

export type ThemeMode = "system" | "light" | "dark";
export type ColorScheme = "light" | "dark";
export type ThemeColors = (typeof themeTokens)[ColorScheme]["colors"];

const STORAGE_KEY = "dayflow:theme";

const cssVars = {
  light: vars(Object.fromEntries(Object.entries(themeTokens.light.colors).map(([name, value]) => [`--${name}`, value]))),
  dark: vars(Object.fromEntries(Object.entries(themeTokens.dark.colors).map(([name, value]) => [`--${name}`, value]))),
};

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  scheme: ColorScheme;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Follows the device until the person picks light or dark; the choice stays on this device, not in the database. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const device = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") setModeState(saved);
    });
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const scheme: ColorScheme = mode === "system" ? (device === "dark" ? "dark" : "light") : mode;
  const value = useMemo(
    () => ({ mode, setMode, scheme, colors: themeTokens[scheme].colors }),
    [mode, setMode, scheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, cssVars[scheme]]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}

/** Re-applies the tokens inside a Modal, which renders outside the root view on the web. */
export function ThemeScope({ children }: { children: ReactNode }) {
  const { scheme } = useTheme();
  return <View style={[{ flex: 1 }, cssVars[scheme]]}>{children}</View>;
}
