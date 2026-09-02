import React from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import { View } from "react-native";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";
import { getBarColor, getBarBgClass } from "@utils/analytics";

interface DayData {
  day: string;
  percentage: number;
}

interface WeeklyTrendCardProps {
  /** Array of daily completion data for the week */
  weekData: DayData[];
  /** Animation delay in milliseconds */
  animationDelay?: number;
}

const WeeklyTrendCard = React.memo<WeeklyTrendCardProps>(
  ({ weekData, animationDelay = 200 }) => {
    const colors = useThemeColors();

    return (
      <Animated.View
        entering={FadeInUp.duration(300).delay(animationDelay)}
        className="bg-card dark:bg-card-dark rounded-2xl p-5 mb-4 border border-border dark:border-border-dark"
      >
        <Text className="text-base font-semibold text-foreground dark:text-foreground-dark mb-4">
          Weekly Trend
        </Text>

        <View className="flex-row items-end justify-around h-40">
          {weekData.map((item, index) => (
            <View key={index} className="items-center flex-1">
              {/* Bar Container */}
              <View className="flex-1 justify-end items-center mb-2 w-full px-1">
                <View
                  className={`w-full rounded-t-lg ${getBarBgClass(
                    item.percentage
                  )}`}
                  style={{
                    height: `${Math.max(item.percentage, 5)}%`,
                    minHeight: 8,
                  }}
                >
                  <View
                    className="w-full rounded-t-lg"
                    style={{
                      height: "100%",
                      backgroundColor: getBarColor(item.percentage, colors),
                      opacity: 0.8,
                    }}
                  />
                </View>
              </View>

              {/* Day Label */}
              <Text className="text-xs text-foreground dark:text-foreground-dark font-medium">
                {item.day}
              </Text>

              {/* Percentage */}
              <Text
                className="text-xs font-bold mt-1"
                style={{ color: getBarColor(item.percentage, colors) }}
              >
                {item.percentage}%
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  }
);

WeeklyTrendCard.displayName = "WeeklyTrendCard";

export default WeeklyTrendCard;
