import { ActivityIndicator, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

export function CenteredSpinner() {
  const { colors } = useTheme();
  return (
    <View accessibilityLabel="Loading" className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator color={colors["muted-foreground"]} />
    </View>
  );
}
