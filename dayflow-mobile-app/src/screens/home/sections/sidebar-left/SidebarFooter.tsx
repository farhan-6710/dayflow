import React, { useState } from "react";
import { View } from "react-native";
import Text from "@components/atoms/Text";
import Button from "@components/atoms/Button";
import ToggleButton from "@components/atoms/ToggleButton";
import { useThemeColors } from "@constants/theme";
import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Moon, Sun } from "lucide-react-native";
import { Appearance, useColorScheme } from "react-native";

interface SidebarFooterProps {
  onClose: () => void;
}

export function SidebarFooter({ onClose }: SidebarFooterProps) {
  const colors = useThemeColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleThemeToggle = (value: boolean) => {
    Appearance.setColorScheme(value ? "dark" : "light");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      Toast.show({
        type: "success",
        text1: "Signed out",
        text2: "You've been logged out successfully.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: "Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
      onClose();
    }
  };

  return (
    <View className="p-4 border-t border-border dark:border-border-dark">
      {/* Theme Toggle */}
      <View className="flex-row items-center justify-between mb-4 p-3 px-4 rounded-2xl bg-card dark:bg-card-dark">
        <View className="flex-row items-center gap-3">
          {isDark ? (
            <Moon size={20} color={colors.primary} strokeWidth={2} />
          ) : (
            <Sun size={20} color={colors.primary} strokeWidth={2} />
          )}
          <Text className="text-foreground dark:text-foreground-dark text-base font-medium">
            {isDark ? "Dark Mode" : "Light Mode"}
          </Text>
        </View>
        <ToggleButton
          initialValue={isDark}
          onToggle={handleThemeToggle}
          size="medium"
          hapticsFeedback={true}
        />
      </View>

      {user ? (
        <Button
          onPress={handleLogout}
          title="Logout"
          variant="primary"
          size="medium"
          loading={isLoggingOut}
          disabled={isLoggingOut}
          icon="log-out-outline"
          iconPosition="right"
          fullWidth
        />
      ) : (
        <Button
          onPress={() => {
            router.push("/auth/login");
            onClose();
          }}
          title="Sign up / Login"
          variant="primary"
          size="medium"
          fullWidth
        />
      )}
    </View>
  );
}
