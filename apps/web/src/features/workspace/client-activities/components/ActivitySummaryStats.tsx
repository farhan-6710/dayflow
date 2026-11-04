import { Calendar, CircleCheck, ListTodo, Phone } from "lucide-react";

import type { ActivitySummaryStatsProps } from "@/features/workspace/client-activities/types/components";
import { isClientActivityOpen } from "@/features/workspace/client-activities/utils/activityFormUtils";
import { SummaryStats } from "@/shared/components/SummaryStats";

/** Totals for a project or client page. `rows` is null until the activities block has loaded them. */
export function ActivitySummaryStats({ rows }: ActivitySummaryStatsProps) {
  const tasks = rows?.task ?? [];
  const openTasks = tasks.filter((row) => isClientActivityOpen(row.status)).length;

  return (
    <SummaryStats
      isLoading={rows === null}
      items={[
        { id: "open", label: "Open Tasks", value: openTasks, icon: ListTodo },
        { id: "completed", label: "Completed", value: tasks.length - openTasks, icon: CircleCheck },
        { id: "meetings", label: "Meetings", value: rows?.meeting.length ?? 0, icon: Calendar },
        { id: "calls", label: "Calls", value: rows?.call.length ?? 0, icon: Phone },
      ]}
    />
  );
}
