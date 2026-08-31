import {
  CLIENT_PORTAL_ANALYTICS_PATH,
  CLIENT_PORTAL_DASHBOARD_PATH,
  CLIENT_PORTAL_NOTIFICATIONS_PATH,
  CLIENT_PORTAL_PROJECTS_PATH,
  CLIENT_PORTAL_SETTINGS_PATH,
} from "@/app/constants/clientPortalRoutes";
import { CLIENT_AUTH_HOME } from "@/features/client/constants/routes";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";
import type { ShellSidebarConfig } from "@/shared/types/components";

const sidebarConfig: ShellSidebarConfig = {
  homeLink: CLIENT_PORTAL_DASHBOARD_PATH,
  brandSubtitle: "Client Portal",
  nav: [
    { label: "Dashboard", to: CLIENT_PORTAL_DASHBOARD_PATH, icon: "dashboard" },
    { label: "Projects", to: CLIENT_PORTAL_PROJECTS_PATH, icon: "projects" },
    {
      label: "Notifications",
      to: CLIENT_PORTAL_NOTIFICATIONS_PATH,
      icon: "notifications",
    },
    { label: "Analytics", to: CLIENT_PORTAL_ANALYTICS_PATH, icon: "analytics" },
    { label: "Settings", to: CLIENT_PORTAL_SETTINGS_PATH, icon: "settings" },
  ],
  searchPlaceholder: "Search pages...",
  profilePath: CLIENT_PORTAL_SETTINGS_PATH,
  quickAction: {
    title: "Your projects",
    description: "View project updates and activities from your provider.",
    buttonLabel: "View Projects",
    buttonTo: CLIENT_PORTAL_PROJECTS_PATH,
  },
};

export function ClientAppLayout() {
  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      accountPath={CLIENT_PORTAL_SETTINGS_PATH}
      settingsPath={CLIENT_PORTAL_SETTINGS_PATH}
      signOutRedirect={CLIENT_AUTH_HOME}
      mobileNavDescription="DayFlow client portal navigation"
    />
  );
}
