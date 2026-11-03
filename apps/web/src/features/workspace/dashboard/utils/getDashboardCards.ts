import { WORKSPACE_PROJECTS_MANAGEMENT_PATH, WORKSPACE_TASKS_CALENDAR_PATH } from "@/app/constants/workspaceRoutes";
import type { StatCardItem } from "@/shared/types/components";

type DashboardCardsInput = {
  stats: { total: number; completed: number; pending: number; overdue: number };
  projectsCount: number;
  sparklines: { completed: number[]; pending: number[] };
  periodLabel: string;
};

export function getDashboardCards({ stats, projectsCount, sparklines, periodLabel }: DashboardCardsInput): StatCardItem[] {
  const period = periodLabel === "All" ? "all time" : periodLabel.toLowerCase();

  return [
    {
      id: "pending",
      label: "Pending tasks",
      value: stats.pending,
      description: `Still to do, ${period}`,
      image: "icon-stat-pending",
      href: WORKSPACE_TASKS_CALENDAR_PATH,
      sparkline: sparklines.pending,
    },
    {
      id: "overdue",
      label: "Overdue tasks",
      value: stats.overdue,
      description: `Past their due date, ${period}`,
      image: "icon-stat-overdue",
      href: WORKSPACE_TASKS_CALENDAR_PATH,
    },
    {
      id: "projects",
      label: "Projects",
      value: projectsCount,
      description: `Created ${period === "all time" ? "so far" : `in ${period}`}`,
      image: "icon-stat-projects",
      href: WORKSPACE_PROJECTS_MANAGEMENT_PATH,
    },
    {
      id: "completed",
      label: "Completed tasks",
      value: `${stats.completed}/${stats.total}`,
      description: `Finished, ${period}`,
      image: "icon-stat-completed",
      href: WORKSPACE_TASKS_CALENDAR_PATH,
      sparkline: sparklines.completed,
    },
  ];
}
