import React from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@components/atoms/Text";
import { StatItem } from "@types";

interface StatsOverviewCardProps {
  /** Array of stat items to display */
  stats: StatItem[];
  /** Animation delay in milliseconds */
  animationDelay?: number;
}

const StatsOverviewCard = React.memo<StatsOverviewCardProps>(
  ({ stats, animationDelay = 150 }) => {
    return (
      <Animated.View
        entering={FadeInUp.duration(300).delay(animationDelay)}
        className="bg-card dark:bg-card-dark rounded-2xl p-5 mb-4 border border-border dark:border-border-dark"
      >
        <View className="flex-row items-center justify-around">
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              {/* Stat Item */}
              <View className="items-center flex-1">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${stat.iconBgClass}`}
                >
                  <Ionicons name={stat.icon} size={24} color={stat.iconColor} />
                </View>
                <Text className="text-xs text-foreground dark:text-foreground-dark uppercase tracking-wider mb-1">
                  {stat.label}
                </Text>
                <Text
                  className={`text-lg font-bold ${
                    stat.valueColorClass ||
                    "text-foreground dark:text-foreground-dark"
                  }`}
                >
                  {stat.value}
                </Text>
              </View>

              {/* Divider (except after last item) */}
              {index < stats.length - 1 && (
                <View className="w-px h-[60px] bg-borderLight dark:bg-borderDark" />
              )}
            </React.Fragment>
          ))}
        </View>
      </Animated.View>
    );
  }
);

StatsOverviewCard.displayName = "StatsOverviewCard";

export default StatsOverviewCard;
