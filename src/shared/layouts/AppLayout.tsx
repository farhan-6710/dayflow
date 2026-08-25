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
    { label: "Projects Management", to: "/projects-management", icon: "projects" },
    { label: "Clients Management", to: "/clients-management", icon: "clients" },
    { label: "Tasks Calendar", to: "/tasks-calendar", icon: "tasks" },
    { label: "Daily Reminders", to: "/daily-reminders", icon: "reminders" },
    { label: "Notifications", to: "/notifications", icon: "notifications" },
    { label: "Analytics", to: "/analytics", icon: "analytics" },
    { label: "Settings", to: "/settings", icon: "settings" },
  ],
  searchPlaceholder: "Search pages...",
  profilePath: "/settings",
  quickAction: {
    title: "Quick Actions",
    description: "Open today's tasks calendar and keep the day on track.",
    buttonLabel: "Tasks Calendar",
    buttonTo: "/tasks-calendar",
  },
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
