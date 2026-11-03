import { eachMonthOfInterval, format, subMonths } from "date-fns";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { MonthSelection, TaskCompletionChartProps } from "@/features/workspace/dashboard/types/components";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
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

export function TaskCompletionChart({ chart, primary, compare, onPrimaryChange, onCompareChange }: TaskCompletionChartProps) {
  const now = new Date();
  const monthOptions = eachMonthOfInterval({ start: subMonths(now, MONTHS_BACK), end: now })
    .reverse()
    .map((date) => ({ value: `${date.getFullYear()}-${date.getMonth() + 1}`, label: format(date, "MMM yyyy") }));
  const growth = chart.growthPercent;

  return (
    <section className={cn(panelClassName, "min-w-0 p-5")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl">Task completion</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            <span className="text-foreground tabular-nums">{chart.primaryTotal}</span> completed vs{" "}
            <span className="tabular-nums">{chart.compareTotal}</span>
            {growth === null ? "" : ` (${growth >= 0 ? "+" : ""}${Math.round(growth)}%)`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OptionDropdown
            label="Month"
            value={encode(primary)}
            onChange={(value) => onPrimaryChange(decode(value))}
            options={monthOptions}
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">vs</span>
          <OptionDropdown
            label="Compare with"
            value={encode(compare)}
            onChange={(value) => onCompareChange(decode(value))}
            options={monthOptions}
            className="w-32"
          />
        </div>
      </div>
      <div
        className="mt-4 h-64"
        role="img"
        aria-label={`Tasks completed per day: ${chart.primaryTotal} in ${chart.primaryLabel}, ${chart.compareTotal} in ${chart.compareLabel}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chart.points} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
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
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-chart-1" />
          {chart.primaryLabel}
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-chart-3" />
          {chart.compareLabel}
        </li>
      </ul>
    </section>
  );
}
