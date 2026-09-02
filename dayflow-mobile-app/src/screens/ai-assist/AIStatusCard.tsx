import React from "react";
import Animated, { FadeInUp, useAnimatedStyle } from "react-native-reanimated";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@components/atoms/Text";
import { getAIStatusConfig, AIStatus } from "@utils/ai-assist";
import { usePulseAnimation } from "@hooks/ai-assist";

interface AIStatusCardProps {
  /** AI status: active, idle, thinking */
  status?: AIStatus;
  /** Animation delay in milliseconds */
  animationDelay?: number;
}

const AIStatusCard = React.memo<AIStatusCardProps>(
  ({ status = "active", animationDelay = 100 }) => {
    const { scale, opacity } = usePulseAnimation(status);

    const pulseStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const config = getAIStatusConfig(status);

    return (
      <Animated.View
        entering={FadeInUp.duration(400).delay(animationDelay)}
        className="mb-6"
      >
        <View className="bg-card dark:bg-card-dark rounded-3xl p-6 border border-border dark:border-border-dark overflow-hidden">
          {/* Glow effect background */}
          <View className="absolute inset-0 items-center justify-center">
            <Animated.View style={pulseStyle}>
              <View
                className="w-64 h-64 rounded-full"
                style={{ backgroundColor: `${config.colors[0]}15` }}
              />
            </Animated.View>
          </View>

          <View className="flex-row items-center justify-between relative z-10">
            {/* AI Orb with status */}
            <View className="flex-row items-center flex-1">
              <View className="relative mr-4">
                {/* Outer glow ring */}
                <Animated.View style={pulseStyle}>
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${config.colors[0]}30` }}
                  />
                </Animated.View>

                {/* Inner orb */}
                <View className="absolute inset-0 items-center justify-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center shadow-lg"
                    style={{ backgroundColor: config.colors[0] }}
                  >
                    <Ionicons name={config.icon} size={24} color="#ffffff" />
                  </View>
                </View>
              </View>

              {/* Status text */}
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground dark:text-foreground-dark mb-1">
                  {config.text}
                </Text>
                <Text className="text-sm text-foreground dark:text-foreground-dark">
                  {config.description}
                </Text>
              </View>
            </View>

            {/* Status indicator dot */}
            <Animated.View style={pulseStyle}>
              <View
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.colors[0] }}
              />
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    );
  }
);

AIStatusCard.displayName = "AIStatusCard";

export default AIStatusCard;
