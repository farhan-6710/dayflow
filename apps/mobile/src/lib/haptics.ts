import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const enabled = Platform.OS !== "web";

export const haptics = {
  tap: () => enabled && void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  success: () => enabled && void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => enabled && void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () => enabled && void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};
