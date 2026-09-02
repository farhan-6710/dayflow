import React from "react";
import { View, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInRight } from "react-native-reanimated";
import Text from "@components/atoms/Text";
import { IconBadge } from "@components/molecules";
import { useThemeColors } from "@constants/theme";
import { getLinearGradientColors } from "@utils/home/utils";
import { ReminderHistoryItem } from "@types";
import { cn } from "@api/utils";

interface ReminderHistoryCardProps {
  /** The reminder history data to display */
  item: ReminderHistoryItem;
  /** The index of the card in the list (for staggered animations) */
  index: number;
  /** Callback when card is pressed */
  onPress?: (item: ReminderHistoryItem) => void;
  /** Whether this is the last card in the list (used to suppress bottom margin) */
  isLast?: boolean;
}

const ReminderHistoryCard = React.memo<ReminderHistoryCardProps>(
  ({ item, index, onPress, isLast }) => {
    const colors = useThemeColors();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    // Calculate completion percentage
    const completionPercentage =
      item.totalReminders > 0
        ? Math.round((item.remindersChecked / item.totalReminders) * 100)
        : 0;

    // Determine status based on completion percentage
    const isFullyCompleted = completionPercentage === 100;
    const isPartiallyCompleted = completionPercentage >= 50;

    // Map completion percentage to status for gradient colors
    const status = isFullyCompleted
      ? "done"
      : isPartiallyCompleted
      ? "upcoming"
      : "missed";

    // Get gradient colors from existing utility
    const gradientColors = getLinearGradientColors(status, isDark);

    const handlePress = () => {
      onPress?.(item);
    };

    return (
      <Animated.View
        entering={FadeInRight.duration(300)
          .delay(index * 100 + 200)
          .springify()
          .damping(40)
          .stiffness(400)}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
          className={cn(
            "relative bg-card dark:bg-card-dark rounded-tr-3xl rounded-bl-3xl p-5 border border-border dark:border-border-dark",
            !isLast && "mb-3"
          )}
        >
          {/* ID Watermark - Positioned subtly */}
          <Text className="absolute right-16 top-0 text-7xl font-black pt-4 opacity-[0.03] dark:opacity-[0.05] text-foreground dark:text-foreground-dark">
            {index + 1}
          </Text>
          {/* Completion Badge */}
          <View className="absolute -top-2 -right-2 z-10">
            <LinearGradient
              colors={gradientColors}
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
                {completionPercentage}%
              </Text>
            </LinearGradient>
          </View>

          <View className="flex-row items-center">
            {/* Date Icon */}
            <View className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 justify-center items-center border border-slate-200 dark:border-slate-700">
              <Ionicons name="calendar" size={28} color={colors.primary} />
            </View>

            {/* Date and Stats Info */}
            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                {item.date}
              </Text>
              <View className="flex-row items-center gap-1 mb-2">
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={isFullyCompleted ? colors.success : colors.text}
                />
                <Text className="text-sm text-slate-600 dark:text-slate-400">
                  {item.remindersChecked} of {item.totalReminders} completed
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: `${completionPercentage}%`,
                    height: "100%",
                    borderRadius: 9999,
                  }}
                />
              </View>
            </View>

            {/* Chevron Button */}
            <View className="flex-row items-center gap-2">
              <IconBadge
                iconName="chevron-forward"
                size={16}
                color={colors.text}
                variant="slate"
              />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

ReminderHistoryCard.displayName = "ReminderHistoryCard";

export default ReminderHistoryCard;
