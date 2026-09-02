import React from "react";
import { Image, View, useColorScheme } from "react-native";
import Text from "@components/atoms/Text";

type BrandMarkProps = {
  title?: string;
  subtitle?: string;
  size?: number;
  grow?: boolean;
};

export default function BrandMark({
  title = "DayFlow",
  subtitle,
  size = 40,
  grow = false,
}: BrandMarkProps) {
  const isDark = useColorScheme() === "dark";
  const logo = isDark
    ? require("@assets/brand/logo-dark-icon.png")
    : require("@assets/brand/logo-light-icon.png");

  return (
    <View
      className={`min-w-0 flex-row items-center ${grow ? "flex-1" : ""}`}
    >
      <Image
        source={logo}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityLabel="DayFlow"
      />
      <View
        className="mx-2.5 h-6 w-px shrink-0 self-center bg-border dark:bg-border-dark"
        style={{ opacity: 0.7 }}
      />
      <View className="min-w-0 shrink">
        <Text
          className="font-semibold text-foreground dark:text-foreground-dark"
          style={{ fontSize: 20, letterSpacing: 0.4 }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            className="mt-0.5 text-[11px] font-semibold uppercase text-muted-foreground dark:text-muted-foreground-dark"
            style={{ letterSpacing: 1.1 }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
