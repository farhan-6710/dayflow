import React from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import Text from "@components/atoms/Text";
import { DUMMY_REMINDERS_LIST } from "@constants/reminders";

type Props = {
  permissionGranted: boolean;
};

export default function StatusCard({ permissionGranted }: Props) {
  const colors = useThemeColors();

  return (
    <Animated.View
      entering={FadeInUp.duration(300).delay(150)}
      className="bg-card dark:bg-card-dark rounded-3xl p-5 mb-6 border border-border dark:border-border-dark"
    >
      <View className="flex-row items-center">
        <View className="flex-1 items-center">
          <Ionicons
            name={permissionGranted ? "checkmark-circle" : "close-circle"}
            size={24}
            color={permissionGranted ? colors.success : colors.error}
          />
          <Text className="text-md text-foreground dark:text-foreground-dark mt-2 uppercase tracking-wider">
            Notifications
          </Text>
          <Text
            className={`text-base font-semibold mt-1 ${
              permissionGranted ? "text-green-500" : "text-red-500"
            }`}
          >
            {permissionGranted ? "Enabled" : "Disabled"}
          </Text>
        </View>

        <View className="w-px h-[60px] bg-borderLight dark:bg-borderDark mx-4" />

        <View className="flex-1 items-center">
          <Ionicons name="calendar" size={24} color={colors.primary} />
          <Text className="text-md text-foreground dark:text-foreground-dark mt-2 uppercase tracking-wider">
            Scheduled
          </Text>
          <Text className="text-base text-foreground dark:text-foreground-dark font-semibold mt-1">
            {DUMMY_REMINDERS_LIST.length} Reminders
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
