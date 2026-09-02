import { useColorScheme } from "react-native";

/** Hex tokens aligned with the web `src/index.css` brand theme. */
export const THEME_COLORS = {
  primary: "#028595",
  secondary: "#1ba4b5",
  accent: "#e25505",

  white: "#ffffff",
  black: "#000000",

  light: {
    primary: "#028595",
    background: "#f4f7f7",
    backgroundTwo: "#ffffff",
    card: "#ffffff",
    active: "#eef2f2",
    text: "#1a2e31",
    heading: "#1a2e31",
    border: "#dce4e5",
    borderTwo: "#dce4e5",
    shadow: "rgba(26, 46, 49, 0.18)",
    gradients: {
      paused: ["#9CA3AF", "#6B7280"],
      upcoming: ["#028595", "#1ba4b5"],
      missed: ["#c94141", "#922e2e"],
      done: ["#2f9e6a", "#028595"],
    },
  },

  dark: {
    primary: "#00b6cf",
    background: "#121212",
    backgroundTwo: "#0e0e0e",
    card: "#0e0e0e",
    active: "#2a2a2a",
    text: "#f2f2f2",
    heading: "#f2f2f2",
    border: "#3d3d3d",
    borderTwo: "#3d3d3d",
    shadow: "rgba(0, 0, 0, 0.45)",
    gradients: {
      paused: ["#4B5563", "#374151"],
      upcoming: ["#00b6cf", "#028595"],
      missed: ["#e05555", "#953333"],
      done: ["#34c77b", "#00b6cf"],
    },
  },

  neutral: {
    gray: "#6b7a7c",
    grayLight: "#9CA3AF",
    grayDark: "#4B5563",
  },

  status: {
    success: "#2f9e6a",
    error: "#c94141",
    warning: "#e25505",
  },
};

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return {
    primary: theme.primary,
    secondary: THEME_COLORS.secondary,
    accent: THEME_COLORS.accent,
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
    gray: isDark ? "#a6a6a6" : THEME_COLORS.neutral.gray,
    success: THEME_COLORS.status.success,
    error: THEME_COLORS.status.error,
    warning: THEME_COLORS.status.warning,
  };
};
