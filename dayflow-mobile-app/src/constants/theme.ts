import { useColorScheme } from "react-native";

export const THEME_COLORS = {
  // Brand Colors
  primary: "#ff7a1a",
  secondary: "#fd9a00",

  // Base Colors
  white: "#ffffff",
  black: "#000000",

  // Light Theme
  light: {
    // Backgrounds
    background: "#ffffff",
    backgroundTwo: "#fafafa", // card
    card: "#ffedd5",
    active: "#eeeeee", // muted

    // Text & Headings
    text: "#0a0a0a", // foreground
    heading: "#0a0a0a", // foreground

    // Borders & Shadows
    border: "#ebebeb",
    borderTwo: "#ebebeb",
    shadow: "rgba(0, 0, 0, 0.8)",

    // Gradients
    gradients: {
      paused: ["#9CA3AF", "#9CA3AF"],
      upcoming: ["#fd9a00", "#f97316"],
      missed: ["#ef4444", "#b91c1c"],
      done: ["#14b8a6", "#0d9488"],
    },
  },

  // Dark Theme
  dark: {
    // Backgrounds
    background: "#070707",
    backgroundTwo: "#0f0f0f", // card-dark
    card: "rgba(124, 45, 18, 0.2)",
    active: "#222222", // muted-dark

    // Text & Headings
    text: "#eeeeee", // foreground-dark
    heading: "#eeeeee", // foreground-dark

    // Borders & Shadows
    border: "#222222", // border-dark
    borderTwo: "#222222", // border-dark
    shadow: "rgba(255, 255, 255, 0.3)",

    // Gradients
    gradients: {
      paused: ["#4B5563", "#4B5563"],
      upcoming: ["#d97706", "#ea580c"],
      missed: ["#ef4444", "#b91c1c"],
      done: ["#059669", "#0d9488"],
    },
  },

  // Neutral Colors
  neutral: {
    gray: "#9CA3AF",
    grayLight: "#9CA3AF",
    grayDark: "#4B5563",
  },

  // Status Colors
  status: {
    success: "#10B981",
    error: "#EF4444",
    warning: "#ffba00",
  },
};

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return {
    primary: THEME_COLORS.primary,
    secondary: THEME_COLORS.secondary,
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
    shadow: theme.shadow,
    gray: THEME_COLORS.neutral.gray,
    success: THEME_COLORS.status.success,
    error: THEME_COLORS.status.error,
    warning: THEME_COLORS.status.warning,
  };
};
