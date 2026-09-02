import React from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";
import { SIDEBAR_MENU_ITEMS } from "@constants/sidebar";

interface SidebarMenuProps {
  onClose: () => void;
}

export function SidebarMenu({ onClose }: SidebarMenuProps) {
  const colors = useThemeColors();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (key: string) => {
    const route = key === "index" ? "/(tabs)" : `/(tabs)/${key}`;
    router.push(route as any);
    onClose();
  };

  const isActive = (key: string) => {
    if (key === "index") {
      return pathname === "/" || pathname === "/(tabs)";
    }
    return pathname.includes(key);
  };

  return (
    <View className="gap-2 px-4 py-4">
      {SIDEBAR_MENU_ITEMS.map(({ key, label, iconName }) => {
        const active = isActive(key);
        return (
          <Pressable
            key={key}
            className={`gap-3 flex-row items-center p-3 px-4 rounded-2xl ${
              active
                ? "bg-primary/10 dark:bg-primary/20"
                : "active:bg-muted dark:active:bg-muted-dark"
            }`}
            onPress={() => handleNavigation(key)}
          >
            <Ionicons
              name={iconName}
              size={20}
              color={active ? colors.primary : colors.heading}
            />
            <Text
              className={`text-base ${
                active
                  ? "text-primary dark:text-primary-dark font-semibold"
                  : "text-foreground dark:text-foreground-dark"
              }`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
