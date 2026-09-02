import { BaseToast, ErrorToast } from "react-native-toast-message";
import { THEME_COLORS } from "@constants/theme";

export const getToastConfig = (isDark: boolean) => ({
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: THEME_COLORS.primary,
        backgroundColor: isDark
          ? THEME_COLORS.dark.backgroundTwo
          : THEME_COLORS.light.backgroundTwo,
        borderLeftWidth: 5,
        borderWidth: 1,
        borderColor: isDark
          ? THEME_COLORS.dark.border
          : THEME_COLORS.light.border,
        borderRadius: 12,
        shadowColor: isDark
          ? THEME_COLORS.dark.shadow
          : THEME_COLORS.light.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 25,
        shadowOpacity: isDark ? 0.2 : 0.15,
        elevation: 15,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
        color: isDark ? THEME_COLORS.dark.heading : THEME_COLORS.light.heading,
      }}
      text2Style={{
        fontSize: 14,
        color: isDark ? THEME_COLORS.dark.text : THEME_COLORS.light.text,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#EF4444",
        backgroundColor: isDark
          ? THEME_COLORS.dark.backgroundTwo
          : THEME_COLORS.light.backgroundTwo,
        borderLeftWidth: 5,
        borderWidth: 1,
        borderColor: isDark
          ? THEME_COLORS.dark.border
          : THEME_COLORS.light.border,
        borderRadius: 12,
        shadowColor: isDark
          ? THEME_COLORS.dark.shadow
          : THEME_COLORS.light.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 25,
        shadowOpacity: isDark ? 0.2 : 0.15,
        elevation: 15,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
        color: isDark ? THEME_COLORS.dark.heading : THEME_COLORS.light.heading,
      }}
      text2Style={{
        fontSize: 14,
        color: isDark ? THEME_COLORS.dark.text : THEME_COLORS.light.text,
      }}
    />
  ),
});
