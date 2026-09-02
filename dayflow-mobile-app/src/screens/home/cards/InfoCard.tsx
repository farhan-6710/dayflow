import React from "react";
import Animated, { FadeInRight } from "react-native-reanimated";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import Text from "@components/atoms/Text";
import { useColorScheme } from "react-native";

type Props = {
  text?: string;
};

export default function InfoCard({
  text = "You'll receive a notification at each Reminder time daily",
}: Props) {
  const colors = useThemeColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Animated.View
      entering={FadeInRight.duration(300).delay(1000)}
      className="rounded-2xl overflow-hidden border border-border dark:border-border-dark mb-4 p-4 bg-card dark:bg-card-dark"
    >
      <View className="flex-row items-start">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{
            backgroundColor: isDark
              ? "rgba(139, 92, 246, 0.2)"
              : "rgba(139, 92, 246, 0.15)",
          }}
        >
          <Ionicons
            name="information-circle"
            size={22}
            color={colors.primary}
          />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-medium text-foreground dark:text-foreground-dark mb-1">
            Daily Notifications
          </Text>
          <Text className="text-xs text-foreground dark:text-foreground-dark leading-5 opacity-80">
            {text}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
