import { ArrowUpRight } from "lucide-react";

import {
  WORKSPACE_PROJECTS_MANAGEMENT_PATH,
  WORKSPACE_TASKS_CALENDAR_PATH,
} from "@/app/constants/workspaceRoutes";
import {
  clientsSparklineData,
  employeesSparklineData,
  missedPostsSparklineData,
  totalPostsSparklineData,
} from "@/shared/fixtures/sparklines";
import type { StatCardItem } from "@/shared/types/statsCards";

type DashboardStats = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  projectsCount: number;
};

export function getDashboardCards(
  stats: DashboardStats,
  periodLabel: string,
): StatCardItem[] {
  const isAll = periodLabel === "All";
  const periodDesc = isAll ? "all time" : periodLabel.toLowerCase();

  return [
    {
      id: "pending-tasks",
      label: "Pending Tasks",
      value: stats.pending,
      icon: ArrowUpRight,
      description: isAll
        ? "Tasks left to complete across all time"
        : `Tasks left to complete in ${periodDesc}`,
      href: WORKSPACE_TASKS_CALENDAR_PATH,
      sparklineData: employeesSparklineData,
      sparklineColor: "var(--primary)",
    },
    {
      id: "overdue-tasks",
      label: "Overdue Tasks",
      value: stats.overdue,
      icon: ArrowUpRight,
      description: isAll
        ? "Tasks past their due date across all time"
        : `Tasks past their due date in ${periodDesc}`,
      href: WORKSPACE_TASKS_CALENDAR_PATH,
      sparklineData: missedPostsSparklineData,
      sparklineColor: "var(--accent)",
    },
    {
      id: "projects",
      label: "Total Projects",
      value: stats.projectsCount,
      icon: ArrowUpRight,
      description: isAll
        ? "Note folders in your workspace"
        : `Note folders created in ${periodDesc}`,
      href: WORKSPACE_PROJECTS_MANAGEMENT_PATH,
      sparklineData: clientsSparklineData,
      sparklineColor: "var(--primary)",
    },
    {
      id: "completed-tasks",
      label: "Completed Tasks",
      value: `${stats.completed}/${stats.total}`,
      icon: ArrowUpRight,
      description: isAll
        ? "Tasks finished successfully across all time"
        : `Tasks finished successfully in ${periodDesc}`,
      href: WORKSPACE_TASKS_CALENDAR_PATH,
      sparklineData: totalPostsSparklineData,
      sparklineColor: "var(--accent)",
    },
  ];
}
