import { eachMonthOfInterval, format, subMonths } from "date-fns";
import { useMemo, useState } from "react";
import { View } from "react-native";
import Svg, { Line, Path } from "react-native-svg";

import { buildCompletionChart, type MonthSelection } from "@/features/today/dashboardData";
import type { Task } from "@/shared/types/types";
import { useTheme } from "@/theme/ThemeProvider";
import { Card } from "@/ui/Card";
import { SelectField } from "@/ui/SelectField";
import { Text } from "@/ui/Text";

const HEIGHT = 120;

function encode({ year, month }: MonthSelection) {
  return `${year}-${month}`;
}

function decode(value: string): MonthSelection {
  const [year, month] = value.split("-").map(Number);
  return { year: year ?? 0, month: month ?? 1 };
}

function linePath(values: number[], width: number, max: number) {
  const step = width / Math.max(1, values.length - 1);
  return values.map((value, index) => `${index === 0 ? "M" : "L"}${index * step} ${HEIGHT - (value / max) * (HEIGHT - 8)}`).join(" ");
}

export function CompletionChart({ tasks }: { tasks: Task[] }) {
  const { colors } = useTheme();
  const now = useMemo(() => new Date(), []);
  const [width, setWidth] = useState(0);
  const [primary, setPrimary] = useState<MonthSelection>({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [compare, setCompare] = useState<MonthSelection>(() => {
    const last = subMonths(now, 1);
    return { year: last.getFullYear(), month: last.getMonth() + 1 };
  });

  const chart = useMemo(() => buildCompletionChart(tasks, primary, compare), [tasks, primary, compare]);
  const options = eachMonthOfInterval({ start: subMonths(now, 11), end: now })
    .reverse()
    .map((date) => ({ value: `${date.getFullYear()}-${date.getMonth() + 1}`, label: format(date, "MMM yyyy") }));

  const primaryValues = chart.points.map((point) => point.primary);
  const compareValues = chart.points.map((point) => point.compare);
  const max = Math.max(1, ...primaryValues, ...compareValues);
  const growth = chart.growthPercent === null ? null : `${chart.growthPercent > 0 ? "+" : ""}${Math.round(chart.growthPercent)}%`;

  return (
    <Card className="gap-3">
      <View>
        <Text variant="heading">Task completion</Text>
        <Text variant="label" tone="muted">
          {`${chart.primaryTotal} completed vs ${chart.compareTotal}${growth ? ` (${growth})` : ""}`}
        </Text>
      </View>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Tasks completed per day: ${chart.primaryTotal} in ${chart.primaryLabel}, ${chart.compareTotal} in ${chart.compareLabel}.`}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        {width > 0 ? (
          <Svg width={width} height={HEIGHT}>
            <Line x1={0} y1={HEIGHT - 0.5} x2={width} y2={HEIGHT - 0.5} stroke={colors.border} />
            <Path d={linePath(compareValues, width, max)} stroke={colors["chart-3"]} strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
            <Path d={linePath(primaryValues, width, max)} stroke={colors["chart-1"]} strokeWidth={2} fill="none" />
          </Svg>
        ) : (
          <View style={{ height: HEIGHT }} />
        )}
      </View>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <SelectField label="Month" value={encode(primary)} options={options} onChange={(value) => setPrimary(decode(value))} />
        </View>
        <View className="flex-1">
          <SelectField label="Compare with" value={encode(compare)} options={options} onChange={(value) => setCompare(decode(value))} />
        </View>
      </View>
    </Card>
  );
}
