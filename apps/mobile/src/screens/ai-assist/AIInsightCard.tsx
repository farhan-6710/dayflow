import React from "react";
import Animated, { FadeInUp, useAnimatedStyle } from "react-native-reanimated";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@components/atoms/Text";
import { getInsightConfig } from "@utils/ai-assist";
import { useShimmerAnimation } from "@hooks/ai-assist";
import { AIInsight } from "@types";

interface AIInsightCardProps {
  /** Array of AI insights */
  insights: AIInsight[];
  /** Animation delay in milliseconds */
  animationDelay?: number;
}

const AIInsightCard = React.memo<AIInsightCardProps>(
  ({ insights, animationDelay = 300 }) => {
    return (
      <Animated.View
        entering={FadeInUp.duration(400).delay(animationDelay)}
        className="mb-6"
      >
        <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark mb-3 uppercase tracking-wide">
          AI Insights
        </Text>

        <View className="gap-3">
          {insights.map((insight, index) => (
            <InsightItem
              key={insight.id}
              insight={insight}
              delay={index * 100}
            />
          ))}
        </View>
      </Animated.View>
    );
  }
);

interface InsightItemProps {
  insight: AIInsight;
  delay: number;
}

const InsightItem = React.memo<InsightItemProps>(({ insight, delay }) => {
  const shimmer = useShimmerAnimation();

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value * 0.3,
  }));

  const config = getInsightConfig(insight.type);

  return (
    <Animated.View
      entering={FadeInUp.duration(300).delay(delay)}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Shimmer effect */}
      <Animated.View
        style={shimmerStyle}
        className="absolute inset-0 rounded-2xl"
      >
        <View
          className="w-full h-full"
          style={{ backgroundColor: `${config.colors[0]}10` }}
        />
      </Animated.View>

      {/* Card content */}
      <View
        className="bg-card dark:bg-card-dark p-4 border-l-4 rounded-2xl"
        style={{ borderLeftColor: config.colors[0] }}
      >
        <View className="flex-row items-start">
          <View
            className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${config.bgClass}`}
          >
            <Ionicons name={config.icon} size={20} color={config.colors[0]} />
          </View>

          <View className="flex-1">
            <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark mb-1">
              {insight.title}
            </Text>
            <Text className="text-xs text-foreground dark:text-foreground-dark leading-5">
              {insight.message}
            </Text>

            {insight.percentage !== undefined && (
              <View className="mt-3">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-xs text-foreground dark:text-foreground-dark">
                    Progress
                  </Text>
                  <Text
                    className="text-xs font-bold"
                    style={{ color: config.colors[0] }}
                  >
                    {insight.percentage}%
                  </Text>
                </View>
                <View className="h-1.5 bg-borderLight dark:bg-borderDark rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${insight.percentage}%`,
                      backgroundColor: config.colors[0],
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

AIInsightCard.displayName = "AIInsightCard";
InsightItem.displayName = "InsightItem";

export default AIInsightCard;
