import type { ThemeColors } from "@/theme/ThemeProvider";

export function tabBarOptions(colors: ThemeColors) {
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.foreground,
    tabBarInactiveTintColor: colors["muted-foreground"],
    tabBarLabelStyle: { fontFamily: "Ovo_400Regular", fontSize: 11 },
    tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
    sceneStyle: { backgroundColor: colors.background },
  };
}
