import React from "react";
import { View, Image, Pressable, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Text from "@components/atoms/Text";
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const colors = useThemeColors();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.push("/(tabs)");
    }
  };

  const handleLogoPress = () => {
    router.push("/(tabs)");
  };

  return (
    <View>
      {/* Navigation Header */}
      {showNavigationHeader && (
        <View
          className="flex-row items-center p-4"
          style={{ backgroundColor: colors.background }}
        >
          <TouchableOpacity onPress={handleBackPress} className="mr-3 p-2">
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900 dark:text-white flex-1">
            {navigationTitle}
          </Text>
        </View>
      )}

      {/* Main Header */}
      <View className="p-10 bg-card dark:bg-card-dark border-y border-border dark:border-border-dark">
        <View className="flex-row items-center">
          <Pressable
            className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl items-center justify-center border-2 border-primary/20 dark:border-primary/30"
            onPress={handleLogoPress}
          >
            <Image
              source={
                isDark
                  ? require("@assets/icons/splash-icon-dark.png")
                  : require("@assets/icons/splash-icon-light.png")
              }
              className="w-10 h-10"
              resizeMode="contain"
            />
          </Pressable>
          <View className="ml-4 flex-1">
            <Text className="text-3xl font-semibold text-foreground dark:text-foreground-dark">
              {title}
            </Text>
            <Text className="text-foreground dark:text-foreground-dark text-sm opacity-80">
              {subtitle}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
