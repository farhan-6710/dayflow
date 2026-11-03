import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { EmptyState } from "@/shared/components/EmptyState";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

type TaskStatusChartProps = {
  data: { name: string; value: number; color: string }[];
};

const tooltipStyle = {
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
};

export function TaskStatusChart({ data }: TaskStatusChartProps) {
  return (
    <section className={cn(panelClassName, "min-w-0 p-5")}>
      <h2 className="text-xl">Tasks by status</h2>
      {data.length === 0 ? (
        <EmptyState bare className="py-6" image="icon-empty-tasks" title="No tasks yet" description="Add tasks in the Tasks Calendar to see this." />
      ) : (
        <>
          <div
            className="mt-2 h-56"
            role="img"
            aria-label={`Tasks by status: ${data.map((row) => `${row.name} ${row.value}`).join(", ")}.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="var(--card)">
                  {data.map((row) => (
                    <Cell key={row.name} fill={row.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {data.map((row) => (
              <li key={row.name} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{row.name}</span>
                <span className="tabular-nums">{row.value}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
