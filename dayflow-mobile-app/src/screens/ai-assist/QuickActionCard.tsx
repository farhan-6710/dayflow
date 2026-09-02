import React from "react";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@components/atoms/Text";
import { QuickAction } from "@types";

interface QuickActionCardProps {
  /** Array of quick actions */
  actions: QuickAction[];
  /** Callback when action is pressed */
  onActionPress: (action: QuickAction) => void;
  /** Animation delay in milliseconds */
  animationDelay?: number;
}

const QuickActionCard = React.memo<QuickActionCardProps>(
  ({ actions, onActionPress, animationDelay = 200 }) => {
    return (
      <Animated.View
        entering={FadeInUp.duration(400).delay(animationDelay)}
        className="mb-6"
      >
        <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark mb-3 uppercase tracking-wide">
          Quick Actions
        </Text>

        <View className="flex-row flex-wrap gap-3">
          {actions.map((action, index) => (
            <ActionButton
              key={action.id}
              action={action}
              onPress={onActionPress}
              delay={index * 50}
            />
          ))}
        </View>
      </Animated.View>
    );
  }
);

interface ActionButtonProps {
  action: QuickAction;
  onPress: (action: QuickAction) => void;
  delay: number;
}

const ActionButton = React.memo<ActionButtonProps>(
  ({ action, onPress, delay }) => {
    const scale = useSharedValue(1);
    const glowOpacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
      opacity: glowOpacity.value,
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      glowOpacity.value = withTiming(0.6, { duration: 150 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      glowOpacity.value = withTiming(0, { duration: 300 });
    };

    return (
      <Animated.View
        entering={FadeInUp.duration(300).delay(delay)}
        style={animatedStyle}
        className="flex-1 min-w-[45%]"
      >
        <Pressable
          onPress={() => onPress(action)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Glow effect */}
          <Animated.View
            style={glowStyle}
            className="absolute -inset-1 rounded-2xl"
          >
            <View
              className="w-full h-full rounded-2xl"
              style={{ backgroundColor: action.colors[0], opacity: 0.4 }}
            />
          </Animated.View>

          {/* Card content */}
          <View className="bg-card dark:bg-card-dark p-4 border border-border dark:border-border-dark rounded-2xl">
            <View className="flex-row items-center mb-2">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: action.colors[0] }}
              >
                <Ionicons name={action.icon} size={20} color="#ffffff" />
              </View>
              <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark flex-1">
                {action.title}
              </Text>
            </View>
            {action.description && (
              <Text className="text-xs text-foreground dark:text-foreground-dark">
                {action.description}
              </Text>
            )}
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

QuickActionCard.displayName = "QuickActionCard";
ActionButton.displayName = "ActionButton";

export default QuickActionCard;
