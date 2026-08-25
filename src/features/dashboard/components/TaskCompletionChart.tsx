import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useTaskCompletionChart } from "@/features/dashboard/hooks/useTaskCompletionChart";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import type { Task } from "@/services/tasksService";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";
import { MonthSelector } from "@/shared/ui/MonthSelector";

function formatGrowthLabel(growthPercent: number | null, compareLabel: string): string | null {
  if (growthPercent === null) return null;
  const rounded = Math.round(growthPercent * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}% vs ${compareLabel}`;
}

export function TaskCompletionChart({ tasks, isLoading }: { tasks: Task[]; isLoading: boolean }) {
  const { primary, compare, setPrimary, setCompare, chart } = useTaskCompletionChart(tasks);
  const growthLabel = formatGrowthLabel(chart.growthPercent, chart.previousMonthLabel);
  const isUp = (chart.growthPercent ?? 0) >= 0;
  const gradientId = `task-completion-${primary.year}-${primary.month}-${compare.year}-${compare.month}`;

  const chartConfig = {
    currentMonth: {
      label: chart.currentMonthLabel,
      color: "var(--primary)",
    },
    previousMonth: {
      label: chart.previousMonthLabel,
      color: "var(--accent)",
    },
  } satisfies ChartConfig;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">Task Completion</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Completed tasks by day — pick any two months to compare.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MonthSelector
            year={primary.year}
            month={primary.month}
            onSelect={(date) =>
              setPrimary({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
              })
            }
          />
          <span className="text-xs text-muted-foreground">vs</span>
          <MonthSelector
            year={compare.year}
            month={compare.month}
            onSelect={(date) =>
              setCompare({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
              })
            }
          />
          {growthLabel ? (
            <div
              className={
                isUp
                  ? "flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
              }
            >
              {isUp ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
              <span>{growthLabel}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="h-75 w-full">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
            <AreaChart
              accessibilityLayer
              data={chart.points}
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
        )}
      </div>
    </div>
  );
}
