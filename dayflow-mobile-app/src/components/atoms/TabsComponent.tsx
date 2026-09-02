import React, { useState } from "react";
import { View, Pressable, Animated } from "react-native";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";

type Tab = {
  key: string;
  label: string;
  node: React.ReactNode;
};

interface TabsProps {
  tabs: Tab[];
  initialActive?: number;
}

export default function TabsComponent({ tabs, initialActive = 0 }: TabsProps) {
  const colors = useThemeColors();
  const [active, setActive] = useState(initialActive);
  const [indicatorPosition] = useState(new Animated.Value(initialActive));
  const [containerWidth, setContainerWidth] = useState(0);

  const handleTabPress = (index: number) => {
    setActive(index);
    Animated.spring(indicatorPosition, {
      toValue: index,
      useNativeDriver: true,
      friction: 12,
      tension: 80,
    }).start();
  };

  const tabWidth = containerWidth / tabs.length;

  return (
    <View className="w-full">
      <View
        className="flex-row bg-background dark:bg-background-dark rounded-full p-1 relative overflow-hidden mb-8 border border-border dark:border-border-dark"
        style={{ height: 50 }}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View
          style={{
            position: "absolute",
            left: 4,
            top: 4,
            bottom: 4,
            width: tabWidth - 8,
            backgroundColor: colors.primary,
            borderRadius: 9999,
            transform: [
              {
                translateX: indicatorPosition.interpolate({
                  inputRange: tabs.map((_, i) => i),
                  outputRange: tabs.map((_, i) => i * tabWidth),
                }),
              },
            ],
          }}
        />
        {tabs.map((t, i) => (
          <Pressable
            key={t.key}
            onPress={() => handleTabPress(i)}
            className="flex-1 py-3 items-center justify-center z-10"
          >
            <Text
              className={`text-sm ${
                i === active
                  ? "text-white font-semibold"
                  : "text-foreground dark:text-foreground-dark"
              }`}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View>{tabs[active]?.node}</View>
    </View>
  );
}
