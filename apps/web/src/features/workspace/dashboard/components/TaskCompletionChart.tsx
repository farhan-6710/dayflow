import { eachMonthOfInterval, format, getDaysInMonth, subMonths } from "date-fns";
import { ChartColumn } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { MonthSelection, TaskCompletionChartProps } from "@/features/workspace/dashboard/types/components";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { PanelHeading } from "@/shared/components/PanelHeading";
import { Phantom } from "@/shared/components/Phantom";
import { Reveal } from "@/shared/components/Reveal";
import { StatCardTrend } from "@/shared/components/StatCardTrend";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

const MONTHS_BACK = 11;

function encode({ year, month }: MonthSelection): string {
  return `${year}-${month}`;
}

function decode(value: string): MonthSelection {
  const [year, month] = value.split("-").map(Number);
  return { year: year ?? 0, month: month ?? 1 };
}

export function TaskCompletionChart({ isLoading, chart, primary, compare, onPrimaryChange, onCompareChange }: TaskCompletionChartProps) {
  const now = new Date();
  const monthOptions = eachMonthOfInterval({ start: subMonths(now, MONTHS_BACK), end: now })
    .reverse()
    .map((date) => ({ value: `${date.getFullYear()}-${date.getMonth() + 1}`, label: format(date, "MMM yyyy") }));
  const growth = chart.growthPercent;
  const primaryDays = getDaysInMonth(new Date(primary.year, primary.month - 1));

  const growthLabel = growth === null ? null : `${growth > 0 ? "+" : ""}${Math.round(growth)}%`;
  const dropdownClass = "w-36 bg-card";
  const totals = [
    { dot: "bg-chart-1", value: chart.primaryTotal, label: `Completed (${chart.primaryLabel})` },
    { dot: "bg-chart-3", value: chart.compareTotal, label: `Completed (${chart.compareLabel})` },
  ];

  const panel = (
    <Reveal as="section" className={cn(panelClassName, "flex h-full min-w-0 flex-col p-4 sm:p-5")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <PanelHeading icon={ChartColumn} title="Task completion" />
          <p className="mt-0.5 text-sm text-muted-foreground sm:pl-7.5">
            <span className="tabular-nums">{chart.primaryTotal}</span> completed vs <span className="tabular-nums">{chart.compareTotal}</span>
            {growthLabel ? ` (${growthLabel})` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OptionDropdown
            label="Month"
            value={encode(primary)}
            onChange={(value) => onPrimaryChange(decode(value))}
            options={monthOptions}
            className={dropdownClass}
          />
          <span className="text-sm text-muted-foreground">vs</span>
          <OptionDropdown
            label="Compare with"
            value={encode(compare)}
            onChange={(value) => onCompareChange(decode(value))}
            options={monthOptions}
            className={dropdownClass}
          />
        </div>
      </div>
      <div
        className="mt-4 min-h-64 flex-1"
        role="img"
        aria-label={`Tasks completed per day: ${chart.primaryTotal} in ${chart.primaryLabel}, ${chart.compareTotal} in ${chart.compareLabel}.`}
      >
        {isLoading ? null : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chart.points} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
              tickFormatter={(day: number) => (day <= primaryDays ? `${chart.primaryLabel.slice(0, 3)} ${day}` : `${day}`)}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
              labelFormatter={(day) => `Day ${day}`}
            />
            <Area type="monotone" dataKey="primary" name={chart.primaryLabel} stroke="var(--chart-1)" strokeWidth={2} fill="var(--chart-1)" fillOpacity={0.15} />
            <Line type="monotone" dataKey="compare" name={chart.compareLabel} stroke="var(--chart-3)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
      <div className="mt-3 grid gap-x-4 gap-y-3 rounded-lg border border-border p-3 min-[420px]:grid-cols-3 min-[420px]:divide-x min-[420px]:divide-border">
        {totals.map((total) => (
          <div key={total.label} className="min-w-0 min-[420px]:pl-4 min-[420px]:first:pl-0">
            <p className="flex items-center gap-2 text-xl leading-tight tabular-nums">
              <span aria-hidden="true" className={cn("size-2 rounded-full", total.dot)} />
              {total.value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{total.label}</p>
          </div>
        ))}
        <div className="min-w-0 min-[420px]:pl-4">
          {growthLabel ? <StatCardTrend delta={growthLabel} /> : <p className="text-xl leading-tight">–</p>}
          <p className="mt-0.5 text-xs text-muted-foreground">vs previous period</p>
        </div>
      </div>
    </Reveal>
  );

  return isLoading ? <Phantom>{panel}</Phantom> : panel;
}
