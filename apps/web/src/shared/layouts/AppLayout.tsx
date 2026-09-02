import { AppShellLayout } from "@/shared/layouts/AppShellLayout";
import {
  WORKSPACE_ANALYTICS_PATH,
  WORKSPACE_CLIENTS_MANAGEMENT_PATH,
  WORKSPACE_DAILY_REMINDERS_PATH,
  WORKSPACE_DASHBOARD_PATH,
  WORKSPACE_NOTIFICATIONS_PATH,
  WORKSPACE_PROJECTS_MANAGEMENT_PATH,
  WORKSPACE_SETTINGS_PATH,
  WORKSPACE_TASKS_CALENDAR_PATH,
} from "@/app/constants/workspaceRoutes";
import { NotificationsHeaderButton } from "@/features/workspace/notifications/components/NotificationsHeaderButton";
import type { ShellSidebarConfig } from "@/shared/types/components";

const sidebarConfig: ShellSidebarConfig = {
  homeLink: WORKSPACE_DASHBOARD_PATH,
  brandSubtitle: "Workspace",
  nav: [
    { label: "Dashboard", to: WORKSPACE_DASHBOARD_PATH, icon: "dashboard" },
    {
      label: "Tasks Calendar",
      to: WORKSPACE_TASKS_CALENDAR_PATH,
      icon: "tasks",
    },
    {
      label: "Projects Management",
      to: WORKSPACE_PROJECTS_MANAGEMENT_PATH,
      icon: "projects",
    },
    {
      label: "Clients Management",
      to: WORKSPACE_CLIENTS_MANAGEMENT_PATH,
      icon: "clients",
    },
    {
      label: "Daily Reminders",
      to: WORKSPACE_DAILY_REMINDERS_PATH,
      icon: "reminders",
    },
    {
      label: "Notifications",
      to: WORKSPACE_NOTIFICATIONS_PATH,
      icon: "notifications",
    },
    { label: "Analytics", to: WORKSPACE_ANALYTICS_PATH, icon: "analytics" },
    { label: "Settings", to: WORKSPACE_SETTINGS_PATH, icon: "settings" },
  ],
  searchPlaceholder: "Search pages...",
  profilePath: WORKSPACE_SETTINGS_PATH,
  quickAction: {
    title: "Quick Actions",
    description: "Open today's tasks calendar and keep the day on track.",
    buttonLabel: "Tasks Calendar",
    buttonTo: WORKSPACE_TASKS_CALENDAR_PATH,
  },
};

export function AppLayout() {
  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      accountPath={WORKSPACE_SETTINGS_PATH}
      settingsPath={WORKSPACE_SETTINGS_PATH}
      headerActions={<NotificationsHeaderButton />}
      mobileNavDescription="DayFlow workspace navigation and links"
    />
  );
}
