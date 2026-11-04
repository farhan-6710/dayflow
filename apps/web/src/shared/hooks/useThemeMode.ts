import { useTheme } from "next-themes";

/** Whether the page is dark right now, and a setter. The choice is remembered by next-themes in the browser. */
export function useThemeMode() {
  const { resolvedTheme, setTheme } = useTheme();

  return {
    isDark: resolvedTheme === "dark",
    setDarkMode: (enabled: boolean) => setTheme(enabled ? "dark" : "light"),
  };
}
