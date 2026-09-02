import React from "react";
import { View, Pressable, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Text from "@components/atoms/Text";
import BrandMark from "@components/molecules/BrandMark";
import { useThemeColors } from "@constants/theme";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  showNavigationHeader?: boolean;
  navigationTitle?: string;
  onBackPress?: () => void;
}

export default function AuthHeader({
  title,
  subtitle,
  showNavigationHeader = false,
  navigationTitle = "Back to Home Screen",
  onBackPress,
}: AuthHeaderProps) {
  const router = useRouter();
  const colors = useThemeColors();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.push("/(tabs)");
    }
  };

  return (
    <View>
      {showNavigationHeader && (
        <View
          className="flex-row items-center p-4"
          style={{ backgroundColor: colors.background }}
        >
          <TouchableOpacity onPress={handleBackPress} className="mr-3 p-2">
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="flex-1 text-xl font-semibold text-foreground dark:text-foreground-dark">
            {navigationTitle}
          </Text>
        </View>
      )}

      <View className="border-y border-border bg-card px-6 py-8 dark:border-border-dark dark:bg-card-dark">
        <Pressable onPress={() => router.push("/(tabs)")}>
          <BrandMark title="DayFlow" size={40} />
        </Pressable>
        <View className="mt-5">
          <Text className="text-2xl font-semibold text-foreground dark:text-foreground-dark">
            {title}
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}
