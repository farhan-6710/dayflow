import { AppShellLayout } from "@/shared/layouts/AppShellLayout";
import {
  ADMIN_PORTAL_ANALYTICS_PATH,
  ADMIN_PORTAL_CLIENTS_MANAGEMENT_PATH,
  ADMIN_PORTAL_DAILY_REMINDERS_PATH,
  ADMIN_PORTAL_DASHBOARD_PATH,
  ADMIN_PORTAL_NOTIFICATIONS_PATH,
  ADMIN_PORTAL_PROJECTS_MANAGEMENT_PATH,
  ADMIN_PORTAL_SETTINGS_PATH,
  ADMIN_PORTAL_TASKS_CALENDAR_PATH,
} from "@/app/constants/adminPortalRoutes";
import { NotificationsHeaderButton } from "@/features/admin/notifications/components/NotificationsHeaderButton";
import type { ShellSidebarConfig } from "@/shared/types/components";

const sidebarConfig: ShellSidebarConfig = {
  homeLink: ADMIN_PORTAL_DASHBOARD_PATH,
  initials: "DF",
  brandName: "DayFlow",
  brandSubtitle: "Admin Portal",
  nav: [
    { label: "Dashboard", to: ADMIN_PORTAL_DASHBOARD_PATH, icon: "dashboard" },
    {
      label: "Tasks Calendar",
      to: ADMIN_PORTAL_TASKS_CALENDAR_PATH,
      icon: "tasks",
    },
    {
      label: "Projects Management",
      to: ADMIN_PORTAL_PROJECTS_MANAGEMENT_PATH,
      icon: "projects",
    },
    {
      label: "Clients Management",
      to: ADMIN_PORTAL_CLIENTS_MANAGEMENT_PATH,
      icon: "clients",
    },
    {
      label: "Daily Reminders",
      to: ADMIN_PORTAL_DAILY_REMINDERS_PATH,
      icon: "reminders",
    },
    {
      label: "Notifications",
      to: ADMIN_PORTAL_NOTIFICATIONS_PATH,
      icon: "notifications",
    },
    { label: "Analytics", to: ADMIN_PORTAL_ANALYTICS_PATH, icon: "analytics" },
    { label: "Settings", to: ADMIN_PORTAL_SETTINGS_PATH, icon: "settings" },
  ],
  searchPlaceholder: "Search pages...",
  profilePath: ADMIN_PORTAL_SETTINGS_PATH,
  quickAction: {
    title: "Quick Actions",
    description: "Open today's tasks calendar and keep the day on track.",
    buttonLabel: "Tasks Calendar",
    buttonTo: ADMIN_PORTAL_TASKS_CALENDAR_PATH,
  },
};

export function AppLayout() {
  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      accountPath={ADMIN_PORTAL_SETTINGS_PATH}
      settingsPath={ADMIN_PORTAL_SETTINGS_PATH}
      headerActions={<NotificationsHeaderButton />}
      mobileNavDescription="DayFlow admin portal navigation and links"
    />
  );
}
