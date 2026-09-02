import React from "react";
import { View } from "react-native";
import Text from "@components/atoms/Text";
import { useUserDisplayData } from "@hooks";

export function SidebarHeader() {
  const { displayName, email, initials } = useUserDisplayData();

  return (
    <View className="justify-center items-center flex-col gap-2 pt-16 pb-6 px-6 border-b border-border dark:border-border-dark">
      <View className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 justify-center items-center overflow-hidden">
        <Text className="text-2xl font-semibold text-primary">{initials}</Text>
      </View>
      <View className="justify-center items-center">
        <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
          {displayName}
        </Text>
        <Text className="text-sm text-foreground dark:text-foreground-dark mt-1">
          {email}
        </Text>
      </View>
    </View>
  );
}
