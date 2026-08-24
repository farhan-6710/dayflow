import { AppShellLayout } from "@/shared/layouts/AppShellLayout";
import { NotificationsHeaderButton } from "@/features/notifications/components/NotificationsHeaderButton";
import type { ShellSidebarConfig } from "@/shared/types/components";

const sidebarConfig: ShellSidebarConfig = {
  homeLink: "/dashboard",
  initials: "DF",
  brandName: "DayFlow",
  brandSubtitle: "Personal Workspace",
  nav: [
    { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
    {
      label: "Tasks",
      to: "/tasks",
      icon: "tasks",
      children: [
        { label: "Task List", to: "/tasks" },
        { label: "Calendar", to: "/tasks-calendar" },
      ],
    },
    { label: "Projects", to: "/projects", icon: "projects" },
    { label: "Reminders", to: "/reminders", icon: "reminders" },
    { label: "Notifications", to: "/notifications", icon: "notifications" },
    { label: "Analytics", to: "/analytics", icon: "analytics" },
    { label: "Settings", to: "/settings", icon: "settings" },
  ],
  searchPlaceholder: "Search pages...",
  profilePath: "/settings",
};

export function AppLayout() {
  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      accountPath="/settings"
      settingsPath="/settings"
      headerActions={<NotificationsHeaderButton />}
      mobileNavDescription="DayFlow personal navigation and workspace links"
    />
  );
}
