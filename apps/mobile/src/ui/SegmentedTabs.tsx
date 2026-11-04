import { Pressable, ScrollView, View } from "react-native";

import { cn } from "@/lib/cn";
import { haptics } from "@/lib/haptics";
import { Text } from "@/ui/Text";

type SegmentedTabsProps<T extends string> = {
  tabs: readonly { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  scroll?: boolean;
};

export function SegmentedTabs<T extends string>({ tabs, value, onChange, scroll }: SegmentedTabsProps<T>) {
  const items = tabs.map((tab) => {
    const active = tab.value === value;
    return (
      <Pressable
        key={tab.value}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        onPress={() => {
          haptics.tap();
          onChange(tab.value);
        }}
        className={cn("min-h-9 flex-row items-center justify-center gap-1.5 rounded-lg px-3", !scroll && "flex-1", active && "bg-primary")}
      >
        <Text variant="label" numberOfLines={1} tone={active ? "inverse" : "muted"}>
          {tab.label}
        </Text>
        {tab.count !== undefined ? (
          <Text variant="caption" tone={active ? "inverse" : "muted"}>
            {tab.count}
          </Text>
        ) : null}
      </Pressable>
    );
  });

  const barClass = "flex-row rounded-xl border border-border bg-card p-1";
  return scroll ? (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className={barClass}>{items}</View>
    </ScrollView>
  ) : (
    <View accessibilityRole="tablist" className={barClass}>
      {items}
    </View>
  );
}
