export type DayflowIconName =
  | "stat-pending"
  | "stat-overdue"
  | "stat-projects"
  | "stat-completed"
  | "stat-tasks"
  | "stat-rate"
  | "stat-notes"
  | "stat-meetings"
  | "stat-calls"
  | "empty-tasks"
  | "empty-projects"
  | "empty-notes"
  | "empty-clients"
  | "empty-reminders"
  | "empty-notifications"
  | "empty-activities"
  | "empty-todos"
  | "empty-links"
  | "empty-search"
  | "extra-sparkles";

export type DayflowIllustrationName =
  | "auth-workspace"
  | "auth-client"
  | "sidebar-workspace"
  | "sidebar-client"
  | "dashboard-hero"
  | "not-a-client"
  | "error";

export type DayflowImageName =
  | `icon-${DayflowIconName}`
  | `illo-${DayflowIllustrationName}`;

export function dayflowImageSrc(name: DayflowImageName, isDark: boolean): string {
  const folder = name.startsWith("icon-") ? "icons" : "illustrations";
  return `/images/dayflow/${folder}/${name}-${isDark ? "dark" : "light"}.webp`;
}
