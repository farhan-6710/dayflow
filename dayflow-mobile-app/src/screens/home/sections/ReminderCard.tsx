import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Reminder } from "@types";
import Text from "@components/atoms/Text";
import { IconBadge } from "@components/molecules";
import { useReminderCardStyles } from "@/hooks";
import { getReminderDisplayStatus } from "@/utils";

interface ReminderCardProps {
  /** The reminder data to display */
  reminder: Reminder;
  /** The index of the card in the list (for staggered animations) */
  index: number;
  /** Callback when card is pressed */
  onPress?: (reminder: Reminder) => void;
}

const ReminderCard = React.memo<ReminderCardProps>(
  ({ reminder, index, onPress }) => {
    // Calculate display status (converts upcoming to missed if time passed)
    const displayStatus = getReminderDisplayStatus(
      reminder.status,
      reminder.hour,
      reminder.minute,
      reminder.repeatDays
    );
    const styles = useReminderCardStyles(displayStatus);

    const handlePress = () => {
      onPress?.(reminder);
    };

    return (
      <Animated.View
        entering={FadeInRight.duration(300)
          .delay(index * 100)
          .springify()
          .damping(40)
          .stiffness(400)}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
          className={styles.container}
        >
          <View className={styles.content}>
            {/* Status Badge */}
            <View className="tag absolute -top-2 -right-2">
              <LinearGradient
                colors={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderTopRightRadius: 8,
                  borderBottomLeftRadius: 8,
                }}
              >
                <Text className="text-[8px] font-semibold tracking-wide uppercase text-white">
                  {styles.badgeText}
                </Text>
              </LinearGradient>
            </View>

            {/* Reminder Icon */}
            <View className={styles.icon}>
              <Ionicons
                name="notifications"
                size={24}
                color={styles.reminderIcon}
              />
            </View>

            {/* Reminder Info */}
            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {reminder.name}
              </Text>
              <Text className="text-sm text-slate-600 dark:text-slate-400">
                {reminder.displayTime}
              </Text>
            </View>

            {/* Action Indicators */}
            <View className="flex-row items-center gap-2">
              <IconBadge
                iconName="notifications"
                size={16}
                color={styles.notificationIcon}
                variant="blue"
              />
              <IconBadge
                iconName="chevron-forward"
                size={16}
                color={styles.chevronIcon}
                variant="slate"
              />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

ReminderCard.displayName = "ReminderCard";

export default ReminderCard;
