import React from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";

interface BestStreakCardProps {
  /** Current streak count */
  currentStreak: number;
  /** Best/longest streak count */
  bestStreak: number;
  /** Animation delay in milliseconds */
  animationDelay?: number;
}

const BestStreakCard = React.memo<BestStreakCardProps>(
  ({ currentStreak, bestStreak, animationDelay = 300 }) => {
    const colors = useThemeColors();

    return (
      <Animated.View
        entering={FadeInUp.duration(300).delay(animationDelay)}
        className="bg-card dark:bg-card-dark rounded-2xl p-5 mb-4 border border-border dark:border-border-dark"
      >
        <Text className="text-base font-semibold text-foreground dark:text-foreground-dark mb-4">
          Streak Performance
        </Text>

        <View className="flex-row items-center justify-around">
          {/* Current Streak */}
          <View className="items-center flex-1">
            <View className="w-16 h-16 rounded-full items-center justify-center mb-3 bg-accent/10">
              <Ionicons name="flame" size={32} color={colors.accent} />
            </View>
            <Text className="text-xs text-foreground dark:text-foreground-dark uppercase tracking-wider mb-1">
              Current
            </Text>
            <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
              {currentStreak}
            </Text>
            <Text className="text-xs text-foreground dark:text-foreground-dark">
              {currentStreak === 1 ? "day" : "days"}
            </Text>
          </View>

          {/* Divider */}
          <View className="w-px h-[80px] bg-border dark:bg-border-dark" />

          {/* Best Streak */}
          <View className="items-center flex-1">
            <View className="w-16 h-16 rounded-full items-center justify-center mb-3 bg-primary/10 dark:bg-primary/20">
              <Ionicons name="trophy" size={32} color={colors.primary} />
            </View>
            <Text className="text-xs text-foreground dark:text-foreground-dark uppercase tracking-wider mb-1">
              Best
            </Text>
            <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
              {bestStreak}
            </Text>
            <Text className="text-xs text-foreground dark:text-foreground-dark">
              {bestStreak === 1 ? "day" : "days"}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }
);

BestStreakCard.displayName = "BestStreakCard";

export default BestStreakCard;
