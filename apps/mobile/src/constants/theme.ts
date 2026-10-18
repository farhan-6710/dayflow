import { useColorScheme } from "react-native";

/**
 * Hex tokens aligned with web `apps/web/src/index.css` (source of truth).
 * Light: 60 cream / 30 honey-gold / 10 chocolate ink.
 * Dark: 60 obsidian / 30 honey-gold / 10 cream ink.
 */
export const THEME_COLORS = {
  primary: "#e9bf55",
  secondary: "#d9a93a",
  accent: "#d9a93a",

  white: "#ffffff",
  black: "#000000",

  light: {
    primary: "#e9bf55",
    primaryForeground: "#17140d",
    background: "#f6f3ea",
    backgroundTwo: "#fffdf8",
    card: "#fffdf8",
    active: "#f1ece0",
    text: "#1c1a17",
    heading: "#1c1a17",
    border: "#d2d2d2",
    borderTwo: "#e9e3d4",
    muted: "#f3efe4",
    mutedForeground: "#7d7668",
    accent: "#d9a93a",
    secondary: "#d9a93a",
    shadow: "rgba(28, 26, 23, 0.12)",
    gradients: {
      paused: ["#a8a08f", "#7d7668"],
      upcoming: ["#e9bf55", "#d9a93a"],
      missed: ["#c4553d", "#8f3a28"],
      done: ["#4f8a4b", "#e9bf55"],
    },
  },

  dark: {
    primary: "#e9bf55",
    primaryForeground: "#17140d",
    background: "#0b0b0b",
    backgroundTwo: "#101010",
    card: "#101010",
    active: "#1c1a14",
    text: "#f3f4f6",
    heading: "#f3f4f6",
    border: "#2c2920",
    borderTwo: "#2c2920",
    muted: "#292929",
    mutedForeground: "#a39a85",
    accent: "#f0cf7a",
    secondary: "#f0cf7a",
    shadow: "rgba(0, 0, 0, 0.45)",
    gradients: {
      paused: ["#6b6249", "#4B5563"],
      upcoming: ["#e9bf55", "#f0cf7a"],
      missed: ["#e2735c", "#a8412f"],
      done: ["#86c07e", "#e9bf55"],
    },
  },

  neutral: {
    gray: "#7d7668",
    grayLight: "#a8a08f",
    grayDark: "#6b6457",
  },

  status: {
    success: "#4f8a4b",
    error: "#c4553d",
    warning: "#d9a93a",
  },
};

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return {
    primary: theme.primary,
    primaryForeground: theme.primaryForeground,
    secondary: theme.secondary,
    accent: theme.accent,
    white: THEME_COLORS.white,
    black: THEME_COLORS.black,
    background: theme.background,
    backgroundTwo: theme.backgroundTwo,
    cardBackground: theme.card,
    active: theme.active,
    text: theme.text,
    heading: theme.heading,
    border: theme.border,
    borderTwo: theme.borderTwo,
    muted: theme.muted,
    mutedForeground: theme.mutedForeground,
    shadow: theme.shadow,
    gray: isDark ? theme.mutedForeground : THEME_COLORS.neutral.gray,
    success: isDark ? "#86c07e" : THEME_COLORS.status.success,
    error: isDark ? "#e2735c" : THEME_COLORS.status.error,
    warning: isDark ? "#e9bf55" : THEME_COLORS.status.warning,
  };
};
