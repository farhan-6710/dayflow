export const THEME_STORAGE_KEY = "DF-theme";

export type ThemePreference = "light" | "dark";

/** App default when the user has not stored a choice. */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = "dark";

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

/** Stored choice wins; otherwise dark. */
export function resolveInitialThemePreference(): ThemePreference {
  return getStoredThemePreference() ?? DEFAULT_THEME_PREFERENCE;
}

export function applyThemeClassToDocument(isDark: boolean) {
  document.body.classList.toggle("dark", isDark);
}

export function applyStoredThemeClassToDocument() {
  applyThemeClassToDocument(isDarkTheme(resolveInitialThemePreference()));
}
