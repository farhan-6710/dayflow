import React, { useState } from "react";
import { Alert, View, useColorScheme } from "react-native";
import Toast from "react-native-toast-message";
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@redux/store";
import { resetReminders } from "@redux/slices/remindersSlice";
import { useThemeColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ResetRemindersButton() {
  const dispatch = useDispatch<AppDispatch>();
  const [isResetting, setIsResetting] = useState(false);
  const colors = useThemeColors();
  const isDark = useColorScheme() === "dark";

  const resetStore = async () => {
    dispatch(resetReminders());
    await AsyncStorage.removeItem("persist:root");
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Reminders",
      "Are you sure you want to reset all reminders? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setIsResetting(true);
            try {
              await resetStore();
              Toast.show({
                type: "success",
                text1: "Reminders reset",
                text2: "All reminders have been reset.",
              });
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Reset failed",
                text2: "Failed to reset reminders.",
              });
              console.error("Reset error:", error);
            } finally {
              setIsResetting(false);
            }
          },
        },
      ]
    );
  };
  const buttonStyle = {
    backgroundColor: isDark ? "rgba(127, 29, 29, 0.2)" : "#FFFFFF",
    borderWidth: 2,
    borderColor: isDark ? "rgba(248, 113, 113, 0.4)" : "#F87171",
    shadowOpacity: 0,
    elevation: 0,
  };

  return (
    <Animated.View entering={FadeInRight.duration(300).delay(800)}>
      <Button
        onPress={handleReset}
        title="Reset All Reminders"
        variant="secondary"
        size="large"
        loading={isResetting}
        disabled={isResetting}
        fullWidth
        className="mb-4 bg-transparent"
        style={buttonStyle}
      >
        <View className="flex-row items-center justify-center gap-2">
          <Ionicons name="trash-outline" size={20} color={colors.error} />
          <Text
            className="font-semibold text-base"
            style={{ color: colors.error }}
          >
            Reset All Reminders
          </Text>
        </View>
      </Button>
    </Animated.View>
  );
}
