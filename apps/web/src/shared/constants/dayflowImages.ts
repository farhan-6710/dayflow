/**
 * DayFlow illustration / 3D icon registry.
 * Drop PNGs into `apps/web/public/images/dayflow/` using these exact filenames.
 */
export const DAYFLOW_IMAGES = {
  statPending: "/images/dayflow/icon-stat-pending.png",
  statOverdue: "/images/dayflow/icon-stat-overdue.png",
  statProjects: "/images/dayflow/icon-stat-projects.png",
  statCompleted: "/images/dayflow/icon-stat-completed.png",
  emptyTasks: "/images/dayflow/icon-empty-tasks.png",
  emptyNotes: "/images/dayflow/icon-empty-notes.png",
  emptyReminders: "/images/dayflow/icon-empty-reminders.png",
  emptyClients: "/images/dayflow/icon-empty-clients.png",
  sidebarFlowLight: "/images/dayflow/illo-sidebar-flow-light.png",
  sidebarFlowDark: "/images/dayflow/illo-sidebar-flow-dark.png",
  dashboardCornerLight: "/images/dayflow/illo-dashboard-corner-light.png",
  dashboardCornerDark: "/images/dayflow/illo-dashboard-corner-dark.png",
} as const;

export type DayflowImageKey = keyof typeof DAYFLOW_IMAGES;
