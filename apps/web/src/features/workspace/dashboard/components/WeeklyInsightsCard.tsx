import { CalendarRange } from "lucide-react";

import type { WeeklyInsightsCardProps } from "@/features/workspace/dashboard/types/components";
import { PanelLink } from "@/shared/components/PanelLink";
import { Phantom } from "@/shared/components/Phantom";
import { WORKSPACE_TASKS_CALENDAR_PATH } from "@/app/constants/workspaceRoutes";
import { PanelHeading } from "@/shared/components/PanelHeading";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

export function WeeklyInsightsCard({ isLoading, completedThisWeek, completedLastWeek, dueThisWeek, busiestDay }: WeeklyInsightsCardProps) {
  const rows = [
    { label: "Completed this week", value: completedThisWeek },
    { label: "Completed last week", value: completedLastWeek },
    { label: "Due this week", value: dueThisWeek },
    { label: "Busiest day", value: busiestDay ?? "None yet" },
  ];

  const panel = (
    <Reveal as="section" className={cn(panelClassName, "min-w-0 p-5")}>
      <PanelHeading
        icon={CalendarRange}
        title="Weekly insights"
        action={<PanelLink to={WORKSPACE_TASKS_CALENDAR_PATH}>View tasks</PanelLink>}
      />
      <dl className="mt-3 divide-y divide-border text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 py-2">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );

  return isLoading ? <Phantom>{panel}</Phantom> : panel;
}
