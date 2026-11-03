import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { ActivitiesByStatusChartProps } from "@/features/client/types/components";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

const SERIES = [
  { key: "pending", name: "Pending", color: "var(--chart-4)" },
  { key: "inProgress", name: "In progress", color: "var(--chart-1)" },
  { key: "completed", name: "Completed", color: "var(--primary)" },
];

export function ActivitiesByStatusChart({ rows }: ActivitiesByStatusChartProps) {
  const summary = rows
    .map((row) => `${row.name}: ${row.pending} pending, ${row.inProgress} in progress, ${row.completed} completed`)
    .join("; ");

  return (
    <section className={cn(panelClassName, "min-w-0 p-5")}>
      <h2 className="text-xl">Activities by status</h2>
      <div className="mt-3 h-56" role="img" aria-label={summary}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: "var(--accent)" }}
              contentStyle={{
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
            />
            {SERIES.map((series) => (
              <Bar key={series.key} dataKey={series.key} name={series.name} stackId="status" fill={series.color} barSize={40} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {SERIES.map((series) => (
          <li key={series.key} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: series.color }} />
            {series.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
