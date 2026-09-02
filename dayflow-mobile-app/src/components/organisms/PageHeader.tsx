import React, { ReactNode } from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";

interface PageHeaderProps {
  /** Icon to display on the left */
  icon: keyof typeof Ionicons.glyphMap;
  /** Icon size */
  iconSize?: number;
  /** Icon color (optional, defaults to primary) */
  iconColor?: string;
  /** Main title text */
  title: string;
  /** Subtitle/description text */
  subtitle: string;
  /** Optional action button on the right */
  actionButton?: ReactNode;
  /** Animation delay in milliseconds */
  animationDelay?: number;
}

const PageHeader = React.memo<PageHeaderProps>(
  ({
    icon,
    iconSize = 42,
    iconColor,
    title,
    subtitle,
    actionButton,
    animationDelay = 100,
  }) => {
    const colors = useThemeColors();
    const displayIconColor = iconColor || colors.primary;

    return (
      <Animated.View
        entering={FadeInUp.duration(200).delay(animationDelay)}
        className="flex-row justify-between items-center pr-6 font-cinzel py-6 border-b border-border dark:border-border-dark"
        style={{ paddingHorizontal: 24 }}
      >
        {/* Icon */}
        <Animated.View>
          <Ionicons name={icon} size={iconSize} color={displayIconColor} />
        </Animated.View>

        {/* Title and Subtitle */}
        <Animated.View className="flex-1 ml-4">
          <Text className="text-[32px] font-semibold text-foreground dark:text-foreground-dark">
            {title}
          </Text>
          <Text className="text-sm text-foreground dark:text-foreground-dark">
            {subtitle}
          </Text>
        </Animated.View>

        {/* Optional Action Button */}
        {actionButton && actionButton}
      </Animated.View>
    );
  }
);

PageHeader.displayName = "PageHeader";

export default PageHeader;
