import { createBrowserRouter, Navigate } from "react-router";

import { LegacyPathRedirect } from "@/app/components/LegacyPathRedirect";
import { LegacyProjectRedirect } from "@/app/components/LegacyProjectRedirect";
import {
  CLIENT_PORTAL_DASHBOARD_PATH,
  CLIENT_PORTAL_PREFIX,
} from "@/app/constants/clientPortalRoutes";
import { LEGACY_ADMIN_PORTAL_PREFIX } from "@/app/constants/legacyRoutes";
import {
  DESKTOP_OAUTH_BRIDGE_PATH,
  OAUTH_CALLBACK_PATH,
} from "@/app/constants/oauthRoutes";
import {
  WORKSPACE_CLIENTS_MANAGEMENT_PATH,
  WORKSPACE_DAILY_REMINDERS_PATH,
  WORKSPACE_DASHBOARD_PATH,
  WORKSPACE_PREFIX,
  WORKSPACE_PROJECTS_MANAGEMENT_PATH,
  WORKSPACE_TASKS_CALENDAR_PATH,
} from "@/app/constants/workspaceRoutes";
import { lazyRoutePage } from "@/app/lazyRoute";
import { ClientProtectedRoute } from "@/features/client/auth/components/ClientProtectedRoute";
import { ClientPublicRoute } from "@/features/client/auth/components/ClientPublicRoute";
import { ClientAppLayout } from "@/features/client/layouts/ClientAppLayout";
import { ProtectedRoute } from "@/features/workspace/auth/components/ProtectedRoute";
import { PublicRoute } from "@/features/workspace/auth/components/PublicRoute";
import { AppLayout } from "@/features/workspace/layouts/AppLayout";
import { CenteredLoading } from "@/shared/components/CenteredLoading";
import { RouteErrorPage } from "@/shared/pages/RouteErrorPage";

const AuthPage = lazyRoutePage(
  () => import("@/features/workspace/auth/pages/AuthPage"),
  "AuthPage",
  <CenteredLoading />,
);
const ProjectsManagementPage = lazyRoutePage(
  () => import("@/features/workspace/projects/pages/ProjectsManagementPage"),
  "ProjectsManagementPage",
);
const ProjectDetailPage = lazyRoutePage(
  () => import("@/features/workspace/projects/pages/ProjectDetailPage"),
  "ProjectDetailPage",
);
const ProjectNotePage = lazyRoutePage(
  () => import("@/features/workspace/projects/pages/ProjectNotePage"),
  "ProjectNotePage",
);
const ClientsManagementPage = lazyRoutePage(
  () => import("@/features/workspace/clients-management/pages/ClientsManagementPage"),
  "ClientsManagementPage",
);
const ClientDetailPage = lazyRoutePage(
  () => import("@/features/workspace/clients-management/pages/ClientDetailPage"),
  "ClientDetailPage",
);
const TasksCalendarPage = lazyRoutePage(
  () => import("@/features/workspace/tasks/pages/TasksCalendarPage"),
  "TasksCalendarPage",
);
const RemindersManagementPage = lazyRoutePage(
  () => import("@/features/workspace/reminders/pages/RemindersManagementPage"),
  "RemindersManagementPage",
);
const NotificationsPage = lazyRoutePage(
  () => import("@/features/workspace/notifications/pages/NotificationsPage"),
  "NotificationsPage",
);
const DashboardPage = lazyRoutePage(
  () => import("@/features/workspace/dashboard/pages/DashboardPage"),
  "DashboardPage",
);
const AnalyticsPage = lazyRoutePage(
  () => import("@/features/workspace/analytics/pages/AnalyticsPage"),
  "AnalyticsPage",
);
const SettingsPage = lazyRoutePage(
  () => import("@/features/workspace/settings/pages/SettingsPage"),
  "SettingsPage",
);
const ClientAuthPage = lazyRoutePage(
  () => import("@/features/client/auth/pages/ClientAuthPage"),
  "ClientAuthPage",
  <CenteredLoading />,
);
const NotAClientPage = lazyRoutePage(
  () => import("@/features/client/auth/pages/NotAClientPage"),
  "NotAClientPage",
  <CenteredLoading />,
);
const ClientDashboardPage = lazyRoutePage(
  () => import("@/features/client/pages/ClientDashboardPage"),
  "ClientDashboardPage",
);
const ClientProjectsPage = lazyRoutePage(
  () => import("@/features/client/pages/ClientProjectsPage"),
  "ClientProjectsPage",
);
const ClientProjectDetailPage = lazyRoutePage(
  () => import("@/features/client/pages/ClientProjectDetailPage"),
  "ClientProjectDetailPage",
);
const ClientNotificationsPage = lazyRoutePage(
  () => import("@/features/client/pages/ClientNotificationsPage"),
  "ClientNotificationsPage",
);
const ClientAnalyticsPage = lazyRoutePage(
  () => import("@/features/client/pages/ClientAnalyticsPage"),
  "ClientAnalyticsPage",
);
const ClientSettingsPage = lazyRoutePage(
  () => import("@/features/client/pages/ClientSettingsPage"),
  "ClientSettingsPage",
);
const OAuthCallbackPage = lazyRoutePage(
  () => import("@/shared/auth/pages/OAuthCallbackPage"),
  "OAuthCallbackPage",
  <CenteredLoading />,
);
const DesktopOAuthBridgePage = lazyRoutePage(
  () => import("@/shared/auth/pages/DesktopOAuthBridgePage"),
  "DesktopOAuthBridgePage",
  <CenteredLoading />,
);

function redirect(path: string, to: string) {
  return { path, element: <Navigate to={to} replace /> };
}

export const router = createBrowserRouter([
  { path: "/", element: <LegacyPathRedirect /> },
  { path: `${LEGACY_ADMIN_PORTAL_PREFIX}/*`, element: <LegacyPathRedirect /> },
  { path: OAUTH_CALLBACK_PATH, element: <OAuthCallbackPage />, errorElement: <RouteErrorPage /> },
  {
    path: DESKTOP_OAUTH_BRIDGE_PATH,
    element: <DesktopOAuthBridgePage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: WORKSPACE_PREFIX,
    errorElement: <RouteErrorPage />,
    children: [
      { element: <PublicRoute />, children: [{ path: "auth", element: <AuthPage /> }] },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", element: <DashboardPage /> },
              { path: "tasks-calendar", element: <TasksCalendarPage /> },
              { path: "projects-management", element: <ProjectsManagementPage /> },
              { path: "projects-management/:id", element: <ProjectDetailPage /> },
              { path: "projects-management/:id/notes/:noteId", element: <ProjectNotePage /> },
              { path: "clients-management", element: <ClientsManagementPage /> },
              { path: "clients-management/:id", element: <ClientDetailPage /> },
              { path: "daily-reminders", element: <RemindersManagementPage /> },
              { path: "notifications", element: <NotificationsPage /> },
              { path: "analytics", element: <AnalyticsPage /> },
              { path: "settings", element: <SettingsPage /> },
              redirect("projects", WORKSPACE_PROJECTS_MANAGEMENT_PATH),
              { path: "projects/:id", element: <LegacyProjectRedirect /> },
              redirect("clients", WORKSPACE_CLIENTS_MANAGEMENT_PATH),
              redirect("tasks", WORKSPACE_TASKS_CALENDAR_PATH),
              redirect("calendar", WORKSPACE_TASKS_CALENDAR_PATH),
              redirect("reminders", WORKSPACE_DAILY_REMINDERS_PATH),
              redirect("*", WORKSPACE_DASHBOARD_PATH),
            ],
          },
        ],
      },
    ],
  },
  {
    path: CLIENT_PORTAL_PREFIX,
    errorElement: <RouteErrorPage />,
    children: [
      { element: <ClientPublicRoute />, children: [{ path: "auth", element: <ClientAuthPage /> }] },
      { path: "not-a-client", element: <NotAClientPage /> },
      {
        element: <ClientProtectedRoute />,
        children: [
          {
            element: <ClientAppLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", element: <ClientDashboardPage /> },
              { path: "projects", element: <ClientProjectsPage /> },
              { path: "projects/:id", element: <ClientProjectDetailPage /> },
              { path: "notifications", element: <ClientNotificationsPage /> },
              { path: "analytics", element: <ClientAnalyticsPage /> },
              { path: "settings", element: <ClientSettingsPage /> },
              redirect("*", CLIENT_PORTAL_DASHBOARD_PATH),
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <LegacyPathRedirect /> },
]);
