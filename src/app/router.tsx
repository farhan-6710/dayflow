import { createBrowserRouter, Navigate, useParams } from "react-router";

import { LegacyPathRedirect } from "@/app/components/LegacyPathRedirect";
import {
  ADMIN_PORTAL_CLIENTS_MANAGEMENT_PATH,
  ADMIN_PORTAL_DAILY_REMINDERS_PATH,
  ADMIN_PORTAL_DASHBOARD_PATH,
  ADMIN_PORTAL_PREFIX,
  ADMIN_PORTAL_PROJECTS_MANAGEMENT_PATH,
  ADMIN_PORTAL_TASKS_CALENDAR_PATH,
} from "@/app/constants/adminPortalRoutes";
import {
  CLIENT_PORTAL_DASHBOARD_PATH,
  CLIENT_PORTAL_PREFIX,
} from "@/app/constants/clientPortalRoutes";
import { OAuthCallbackPage } from "@/features/admin/auth/pages/OAuthCallbackPage";
import { OAUTH_CALLBACK_PATH } from "@/app/constants/oauthRoutes";
import { lazyRoutePage } from "@/app/lazyRoute";
import { PublicRoute } from "@/features/admin/auth/components/PublicRoute";
import { ProtectedRoute } from "@/features/admin/auth/components/ProtectedRoute";
import { RouteErrorPage } from "@/shared/pages/RouteErrorPage";
import { ClientPublicRoute } from "@/features/client/auth/components/ClientPublicRoute";
import { ClientProtectedRoute } from "@/features/client/auth/components/ClientProtectedRoute";
import { ClientAppLayout } from "@/features/client/layouts/ClientAppLayout";
import { AppLayout } from "@/shared/layouts/AppLayout";

const AuthPage = lazyRoutePage(
  () => import("@/features/admin/auth/pages/AuthPage"),
  "AuthPage",
);

const DashboardPage = lazyRoutePage(
  () => import("@/features/admin/dashboard/pages/DashboardPage"),
  "DashboardPage",
);

const ProjectsManagementPage = lazyRoutePage(
  () => import("@/features/admin/projects/pages/ProjectsManagementPage"),
  "ProjectsManagementPage",
);

const ProjectDetailPage = lazyRoutePage(
  () => import("@/features/admin/projects/pages/ProjectDetailPage"),
  "ProjectDetailPage",
);

const ProjectNotePage = lazyRoutePage(
  () => import("@/features/admin/projects/pages/ProjectNotePage"),
  "ProjectNotePage",
);

const ClientsManagementPage = lazyRoutePage(
  () => import("@/features/admin/clients-management/pages/ClientsManagementPage"),
  "ClientsManagementPage",
);

const ClientDetailPage = lazyRoutePage(
  () => import("@/features/admin/clients-management/pages/ClientDetailPage"),
  "ClientDetailPage",
);

const TasksCalendarPage = lazyRoutePage(
  () => import("@/features/admin/tasks/pages/TasksCalendarPage"),
  "TasksCalendarPage",
);

const RemindersManagementPage = lazyRoutePage(
  () => import("@/features/admin/reminders/pages/RemindersManagementPage"),
  "RemindersManagementPage",
);

const NotificationsPage = lazyRoutePage(
  () => import("@/features/admin/notifications/pages/NotificationsPage"),
  "NotificationsPage",
);

const AnalyticsPage = lazyRoutePage(
  () => import("@/features/admin/analytics/pages/AnalyticsPage"),
  "AnalyticsPage",
);

const SettingsPage = lazyRoutePage(
  () => import("@/features/admin/settings/pages/SettingsPage"),
  "SettingsPage",
);

const ClientAuthPage = lazyRoutePage(
  () => import("@/features/client/auth/pages/ClientAuthPage"),
  "ClientAuthPage",
);

const NotAClientPage = lazyRoutePage(
  () => import("@/features/client/auth/pages/NotAClientPage"),
  "NotAClientPage",
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

function ProjectDetailLegacyRedirect() {
  const { id } = useParams();
  return (
    <Navigate to={`${ADMIN_PORTAL_PROJECTS_MANAGEMENT_PATH}/${id}`} replace />
  );
}

export const router = createBrowserRouter([
  {
    path: OAUTH_CALLBACK_PATH,
    element: <OAuthCallbackPage />,
  },
  {
    path: "/",
    element: <LegacyPathRedirect />,
  },
  {
    path: ADMIN_PORTAL_PREFIX,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: "auth",
            element: <AuthPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="dashboard" replace />,
              },
              {
                path: "dashboard",
                element: <DashboardPage />,
              },
              {
                path: "projects-management",
                element: <ProjectsManagementPage />,
              },
              {
                path: "projects-management/:id/notes/:noteId",
                element: <ProjectNotePage />,
              },
              {
                path: "projects-management/:id",
                element: <ProjectDetailPage />,
              },
              {
                path: "projects",
                element: (
                  <Navigate to={ADMIN_PORTAL_PROJECTS_MANAGEMENT_PATH} replace />
                ),
              },
              {
                path: "projects/:id",
                element: <ProjectDetailLegacyRedirect />,
              },
              {
                path: "clients-management/:id",
                element: <ClientDetailPage />,
              },
              {
                path: "clients-management",
                element: <ClientsManagementPage />,
              },
              {
                path: "clients",
                element: (
                  <Navigate to={ADMIN_PORTAL_CLIENTS_MANAGEMENT_PATH} replace />
                ),
              },
              {
                path: "tasks",
                element: (
                  <Navigate to={ADMIN_PORTAL_TASKS_CALENDAR_PATH} replace />
                ),
              },
              {
                path: "tasks-calendar",
                element: <TasksCalendarPage />,
              },
              {
                path: "calendar",
                element: (
                  <Navigate to={ADMIN_PORTAL_TASKS_CALENDAR_PATH} replace />
                ),
              },
              {
                path: "daily-reminders",
                element: <RemindersManagementPage />,
              },
              {
                path: "reminders",
                element: (
                  <Navigate to={ADMIN_PORTAL_DAILY_REMINDERS_PATH} replace />
                ),
              },
              {
                path: "notifications",
                element: <NotificationsPage />,
              },
              {
                path: "analytics",
                element: <AnalyticsPage />,
              },
              {
                path: "settings",
                element: <SettingsPage />,
              },
              {
                path: "*",
                element: <Navigate to={ADMIN_PORTAL_DASHBOARD_PATH} replace />,
              },
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
      {
        element: <ClientPublicRoute />,
        children: [
          {
            path: "auth",
            element: <ClientAuthPage />,
          },
        ],
      },
      {
        path: "not-a-client",
        element: <NotAClientPage />,
      },
      {
        element: <ClientProtectedRoute />,
        children: [
          {
            element: <ClientAppLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="dashboard" replace />,
              },
              {
                path: "dashboard",
                element: <ClientDashboardPage />,
              },
              {
                path: "projects",
                element: <ClientProjectsPage />,
              },
              {
                path: "projects/:id",
                element: <ClientProjectDetailPage />,
              },
              {
                path: "notifications",
                element: <ClientNotificationsPage />,
              },
              {
                path: "analytics",
                element: <ClientAnalyticsPage />,
              },
              {
                path: "settings",
                element: <ClientSettingsPage />,
              },
              {
                path: "*",
                element: <Navigate to={CLIENT_PORTAL_DASHBOARD_PATH} replace />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <LegacyPathRedirect />,
  },
]);
