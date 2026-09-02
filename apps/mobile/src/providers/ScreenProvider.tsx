import React, { ReactNode } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReminderDayCycle } from "@hooks/reminders/useReminderDayCycle";
import { useThemeColors } from "@constants/theme";

interface ScreenProviderProps {
  children: ReactNode;
  edges?: Array<"top" | "left" | "right" | "bottom">;
}

export const ScreenProvider: React.FC<ScreenProviderProps> = ({
  children,
  edges = ["top", "left", "right", "bottom"],
}) => {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  useReminderDayCycle();

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
      edges={edges}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
        translucent={false}
      />
      {children}
    </SafeAreaView>
  );
};
