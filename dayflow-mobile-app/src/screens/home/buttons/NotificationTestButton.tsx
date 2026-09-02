import React, { useRef } from "react";
import { TouchableOpacity, Alert } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import { useNotification } from "@notifications/context/NotificationProvider";
import { useTestNotification } from "@notifications/hooks/useTestNotification";
import Text from "@components/atoms/Text";

export default function NotificationTestButton() {
  const colors = useThemeColors();
  const { expoPushToken } = useNotification();
  const { mutate: sendTestNotification, isPending } = useTestNotification();
  const lastClickTimeRef = useRef<number>(0);

  const handleTestNotification = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    const debounceTime = 5000; // 5 seconds in milliseconds

    // Check if less than 5 seconds have passed since last click
    if (timeSinceLastClick < debounceTime && lastClickTimeRef.current !== 0) {
      const remainingTime = Math.ceil(
        (debounceTime - timeSinceLastClick) / 1000
      );
      Alert.alert(
        "Please wait",
        `Please wait ${remainingTime} seconds before sending another test notification.`
      );
      return;
    }

    if (!expoPushToken) {
      Alert.alert("Error", "No push notification token available");
      return;
    }

    // Update last click time
    lastClickTimeRef.current = now;

    sendTestNotification({
      to: expoPushToken,
      title: "Hi, Farhan 👋😎",
      body: "Your device is all set to recieve notifications !!!",
      data: {},
      sound: "notification_sound.wav",
      priority: "high",
      vibrate: "true",
      vibrationPattern: [0, 250, 250, 250],
      channelId: "custom_channel",
      categoryId: "custom_category", // Add category for action buttons
    });
  };

  return (
    <Animated.View entering={FadeInRight.duration(300).delay(900)}>
      <TouchableOpacity
        className="flex-row items-center justify-center bg-white dark:bg-primary/20 border-2 border-primary dark:border-primary/40 rounded-xl p-4 mb-"
        onPress={handleTestNotification}
        activeOpacity={0.7}
        disabled={isPending || !expoPushToken}
      >
        <Ionicons
          name={isPending ? "time" : "checkmark-circle"}
          size={20}
          color={colors.primary}
        />
        <Text className="text-base font-semibold text-primary ml-2">
          {isPending ? "Sending..." : "Test Notifications"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
