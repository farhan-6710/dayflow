export const THEME_STORAGE_KEY = "DF-theme";

export type ThemePreference = "light" | "dark";

export function getStoredThemePreference(): ThemePreference | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  return null;
}

export function setStoredThemePreference(theme: ThemePreference) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function isDarkTheme(theme: ThemePreference) {
  return theme === "dark";
}

export function getSystemThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Stored choice wins; otherwise follow the OS. */
export function resolveInitialThemePreference(): ThemePreference {
  return getStoredThemePreference() ?? getSystemThemePreference();
}

export function applyThemeClassToDocument(isDark: boolean) {
  document.body.classList.toggle("dark", isDark);
}

export function applyStoredThemeClassToDocument() {
  const stored = getStoredThemePreference();
  const isDark =
    stored === "dark" ||
    (stored == null && getSystemThemePreference() === "dark");
  applyThemeClassToDocument(isDark);
}
