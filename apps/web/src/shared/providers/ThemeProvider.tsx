import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  applyThemeClassToDocument,
  applyStoredThemeClassToDocument,
  isDarkTheme,
  resolveInitialThemePreference,
  setStoredThemePreference,
  type ThemePreference,
} from "@/shared/utils/themePreferenceStorage";
import {
  applyBrandFavicon,
  applyStoredBrandFavicon,
} from "@/shared/utils/brandFavicon";

type ThemeContextValue = {
  isDarkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

// Run before the first paint so the first frame matches stored theme or dark default.
applyStoredThemeClassToDocument();
applyStoredBrandFavicon();

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemePreference>(resolveInitialThemePreference);
  const isDarkMode = isDarkTheme(theme);

  useEffect(() => {
    applyThemeClassToDocument(isDarkMode);
    applyBrandFavicon(isDarkMode);
  }, [isDarkMode]);

  const setDarkMode = useCallback((enabled: boolean) => {
    const next: ThemePreference = enabled ? "dark" : "light";
    setTheme(next);
    setStoredThemePreference(next);
  }, []);

  const value = useMemo(
    () => ({ isDarkMode, setDarkMode }),
    [isDarkMode, setDarkMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook is intentionally colocated with its provider and private context.
// eslint-disable-next-line react-refresh/only-export-components -- provider + hook pattern
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
