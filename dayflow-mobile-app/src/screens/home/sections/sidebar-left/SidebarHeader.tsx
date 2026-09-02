import React from "react";
import { View } from "react-native";
import Text from "@components/atoms/Text";
import BrandMark from "@components/molecules/BrandMark";
import { useUserDisplayData } from "@hooks";

export function SidebarHeader() {
  const { displayName, email, initials } = useUserDisplayData();

  return (
    <View className="flex-col gap-4 px-6 pb-6 pt-10 border-b border-border dark:border-border-dark">
      <BrandMark title="DayFlow" size={39} />
      <View className="items-center gap-2">
        <View className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 justify-center items-center overflow-hidden">
          <Text className="text-xl font-semibold text-primary dark:text-primary-dark">
            {initials}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            {displayName}
          </Text>
          <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark mt-1">
            {email}
          </Text>
        </View>
      </View>
    </View>
  );
}
