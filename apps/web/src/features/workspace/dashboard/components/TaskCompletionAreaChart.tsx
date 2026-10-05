import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { TaskCompletionChartPoint } from "@/features/workspace/dashboard/types/taskCompletionChart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";

type TaskCompletionAreaChartProps = {
  config: ChartConfig;
  points: TaskCompletionChartPoint[];
  gradientId: string;
};

export function TaskCompletionAreaChart({
  config,
  points,
  gradientId,
}: TaskCompletionAreaChartProps) {
  return (
    <ChartContainer config={config} className="aspect-auto h-full w-full">
      <AreaChart
        accessibilityLayer
        data={points}
        margin={{ top: 8, right: 10, left: -16, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`${gradientId}-current`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-currentMonth)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-currentMonth)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id={`${gradientId}-previous`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-previousMonth)" stopOpacity={0.28} />
            <stop offset="95%" stopColor="var(--color-previousMonth)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={1}
          minTickGap={8}
          className="font-medium text-muted-foreground"
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="font-medium text-muted-foreground"
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          content={<ChartTooltipContent />}
        />
        <Area
          dataKey="previousMonth"
          type="natural"
          stroke="var(--color-previousMonth)"
          strokeWidth={2}
          fill={`url(#${gradientId}-previous)`}
          fillOpacity={1}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Area
          dataKey="currentMonth"
          type="natural"
          stroke="var(--color-currentMonth)"
          strokeWidth={2.5}
          fill={`url(#${gradientId}-current)`}
          fillOpacity={1}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
