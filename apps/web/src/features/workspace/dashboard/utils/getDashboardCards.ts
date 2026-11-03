import { WORKSPACE_PROJECTS_MANAGEMENT_PATH, WORKSPACE_TASKS_CALENDAR_PATH } from "@/app/constants/workspaceRoutes";
import { seriesDelta } from "@/features/workspace/dashboard/utils/dashboardData";
import type { StatCardItem } from "@/shared/types/components";

type DashboardCardsInput = {
  stats: { total: number; completed: number; pending: number; overdue: number };
  projectsCount: number;
  sparklines: { pending: number[]; overdue: number[]; projects: number[]; completed: number[] };
  periodLabel: string;
};

/** Trend for a card: last 7 days against the 7 before, where going up is good or bad per card. */
function trendFor(series: number[], upIsGood: boolean) {
  const delta = seriesDelta(series);
  return {
    sparkline: series,
    delta: `${delta > 0 ? "+" : ""}${delta}`,
    deltaLabel: "vs last week",
    trend: (delta === 0 || delta > 0 === upIsGood ? "positive" : "negative") as StatCardItem["trend"],
  };
}

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
      ...trendFor(sparklines.pending, false),
    },
    {
      id: "overdue",
      label: "Overdue tasks",
      value: stats.overdue,
      description: `Past their due date, ${period}`,
      image: "icon-stat-overdue",
      href: WORKSPACE_TASKS_CALENDAR_PATH,
      ...trendFor(sparklines.overdue, false),
    },
    {
      id: "projects",
      label: "Projects",
      value: projectsCount,
      description: `Created ${period === "all time" ? "so far" : `in ${period}`}`,
      image: "icon-stat-projects",
      href: WORKSPACE_PROJECTS_MANAGEMENT_PATH,
      ...trendFor(sparklines.projects, true),
    },
    {
      id: "completed",
      label: "Completed tasks",
      value: `${stats.completed}/${stats.total}`,
      description: `Finished, ${period}`,
      image: "icon-stat-completed",
      href: WORKSPACE_TASKS_CALENDAR_PATH,
      ...trendFor(sparklines.completed, true),
    },
  ];
}
