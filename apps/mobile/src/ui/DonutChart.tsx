import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

export type DonutSlice = { label: string; value: number; color: string };

type DonutChartProps = {
  slices: DonutSlice[];
  centerValue: string;
  centerLabel: string;
  size?: number;
};

export function DonutChart({ slices, centerValue, centerLabel, size = 148 }: DonutChartProps) {
  const { colors } = useTheme();
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  let offset = 0;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={slices.map((slice) => `${slice.label}: ${slice.value}`).join(", ")}
      className="flex-row items-center gap-4"
    >
      <View style={{ width: size, height: size }} className="items-center justify-center">
        <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.muted} strokeWidth={stroke} fill="none" />
          {total > 0
            ? slices.map((slice) => {
                const length = (slice.value / total) * circumference;
                const dash = (
                  <Circle
                    key={slice.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={slice.color}
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={`${length} ${circumference - length}`}
                    strokeDashoffset={-offset}
                  />
                );
                offset += length;
                return dash;
              })
            : null}
        </Svg>
        <Text variant="stat">{centerValue}</Text>
        <Text variant="caption" tone="muted">
          {centerLabel}
        </Text>
      </View>
      <View className="flex-1 gap-2">
        {slices.map((slice) => (
          <View key={slice.label} className="flex-row items-center gap-2">
            <View style={{ backgroundColor: slice.color }} className="size-2.5 rounded-full" />
            <Text variant="label" className="flex-1" numberOfLines={1}>
              {slice.label}
            </Text>
            <Text variant="label" tone="muted">
              {slice.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
