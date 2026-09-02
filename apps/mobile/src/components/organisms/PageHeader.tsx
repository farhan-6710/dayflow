import React, { ReactNode } from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import BrandMark from "@components/molecules/BrandMark";

interface PageHeaderProps {
  /** Kept for call-site compatibility; brand mark is used instead. */
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  title: string;
  subtitle: string;
  actionButton?: ReactNode;
  animationDelay?: number;
}

const PageHeader = React.memo<PageHeaderProps>(
  ({ title, subtitle, actionButton, animationDelay = 100 }) => {
    const brandSubtitle = title === "DayFlow" ? subtitle : title;

    return (
      <Animated.View
        entering={FadeInUp.duration(200).delay(animationDelay)}
        className="flex-row items-center justify-between border-b border-border py-5 dark:border-border-dark"
        style={{ paddingHorizontal: 24 }}
      >
        <BrandMark title="DayFlow" subtitle={brandSubtitle} grow />
        {actionButton ? actionButton : null}
      </Animated.View>
    );
  },
);

PageHeader.displayName = "PageHeader";

export default PageHeader;
