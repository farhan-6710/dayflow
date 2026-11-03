import type { WeeklyInsightsCardProps } from "@/features/workspace/dashboard/types/components";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

export function WeeklyInsightsCard({ completedThisWeek, completedLastWeek, dueThisWeek, busiestDay }: WeeklyInsightsCardProps) {
  const rows = [
    { label: "Completed this week", value: completedThisWeek },
    { label: "Completed last week", value: completedLastWeek },
    { label: "Due this week", value: dueThisWeek },
    { label: "Busiest day", value: busiestDay ?? "None yet" },
  ];

  return (
    <section className={cn(panelClassName, "min-w-0 p-5")}>
      <h2 className="text-xl">Weekly insights</h2>
      <dl className="mt-3 divide-y divide-border text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 py-2">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
