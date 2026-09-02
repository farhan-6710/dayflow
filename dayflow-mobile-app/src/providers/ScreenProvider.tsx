import React, { ReactNode } from "react";
import { StatusBar, Platform, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReminderDayCycle } from "@hooks/reminders/useReminderDayCycle";

interface ScreenProviderProps {
  children: ReactNode;
  edges?: Array<"top" | "left" | "right" | "bottom">;
}

export const ScreenProvider: React.FC<ScreenProviderProps> = ({
  children,
  edges = ["top", "left", "right", "bottom"],
}) => {
  const colorScheme = useColorScheme();
  useReminderDayCycle();

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
      edges={edges}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={
          Platform.OS === "android"
            ? colorScheme === "dark"
              ? "#020618"
              : "#f3f4f6"
            : colorScheme === "dark"
            ? "#020618"
            : "#f3f4f6"
        }
        translucent={false}
      />
      {children}
    </SafeAreaView>
  );
};
