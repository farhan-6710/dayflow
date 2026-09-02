import { StyleSheet, useWindowDimensions, useColorScheme } from "react-native";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import TabBarButton from "./TabBarButton";
import { useThemeColors } from "@constants/theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(1000)}
      style={[
        styles.tabbar,
        {
          width: width,
          backgroundColor: colors.backgroundTwo,
          borderStyle: "solid",
          borderTopColor: colors.border,
          borderLeftColor: colors.border,
          borderRightColor: colors.border,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          // iOS shadow - more prominent
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 25,
          shadowOpacity: isDark ? 0.2 : 0.15,
          // Android elevation
          elevation: 15,
        },
      ]}
    >
      {state.routes.map((route, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? String(options.tabBarLabel)
            : options.title !== undefined
            ? options.title
            : route.name;

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            style={styles.tabbarItem}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? colors.primary : colors.gray}
            label={label}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: -1,
    left: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderCurve: "continuous",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});

export default TabBar;
