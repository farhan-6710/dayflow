import { useColorScheme } from "react-native";
import { DisplayReminderStatus } from "@types";
import {
  getReminderClasses,
  getReminderIconClasses,
  getLinearGradientColors,
  getReminderIconColor,
  getReminderBadgeText,
  getReminderContentClasses,
  getNotificationIconColor,
  getChevronIconColor,
} from "@utils/home/utils";

/**
 * Custom hook for ReminderCard styling logic
 * Consolidates all style calculations for cleaner component code
 *
 * @param status - The reminder status from the database
 * @returns Object containing all style classes and color values
 *
 * @example
 * const styles = useReminderCardStyles("done");
 * <View className={styles.container} />
 */
export function useReminderCardStyles(status: DisplayReminderStatus) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    // CSS Classes
    container: getReminderClasses(status),
    content: getReminderContentClasses(status),
    icon: getReminderIconClasses(status),

    // Colors
    gradient: getLinearGradientColors(status, isDark),
    reminderIcon: getReminderIconColor(status, isDark),
    notificationIcon: getNotificationIconColor(isDark),
    chevronIcon: getChevronIconColor(isDark),

    // Text
    badgeText: getReminderBadgeText(status),

    // Theme
    isDark,
  };
}
