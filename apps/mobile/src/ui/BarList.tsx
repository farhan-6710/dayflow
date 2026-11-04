import { View } from "react-native";

import { Text } from "@/ui/Text";

type BarListProps = {
  rows: { key: string; label: string; value: number; color?: string; caption?: string }[];
};

/** Labelled horizontal bars: reads well at phone width, unlike a column chart. */
export function BarList({ rows }: BarListProps) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <View className="gap-3">
      {rows.map((row) => (
        <View key={row.key} accessible accessibilityLabel={`${row.label}: ${row.caption ?? row.value}`} className="gap-1">
          <View className="flex-row items-center justify-between gap-3">
            <Text variant="label" numberOfLines={1} className="flex-1">
              {row.label}
            </Text>
            <Text variant="label" tone="muted">
              {row.caption ?? row.value}
            </Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-muted">
            <View style={{ width: `${(row.value / max) * 100}%`, backgroundColor: row.color }} className="h-full rounded-full bg-chart-1" />
          </View>
        </View>
      ))}
    </View>
  );
}
