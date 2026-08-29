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
import { lazyRoutePage } from "@/app/lazyRoute";
import { PublicRoute } from "@/features/auth/components/PublicRoute";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { RouteErrorPage } from "@/shared/pages/RouteErrorPage";
import { AppLayout } from "@/shared/layouts/AppLayout";

const AuthPage = lazyRoutePage(
  () => import("@/features/auth/pages/AuthPage"),
  "AuthPage",
);

const DashboardPage = lazyRoutePage(
  () => import("@/features/dashboard/pages/DashboardPage"),
  "DashboardPage",
);

const ProjectsManagementPage = lazyRoutePage(
  () => import("@/features/projects/pages/ProjectsManagementPage"),
  "ProjectsManagementPage",
);

const ProjectDetailPage = lazyRoutePage(
  () => import("@/features/projects/pages/ProjectDetailPage"),
  "ProjectDetailPage",
);

const ProjectNotePage = lazyRoutePage(
  () => import("@/features/projects/pages/ProjectNotePage"),
  "ProjectNotePage",
);

const ClientsManagementPage = lazyRoutePage(
  () => import("@/features/clients-management/pages/ClientsManagementPage"),
  "ClientsManagementPage",
);

const ClientDetailPage = lazyRoutePage(
  () => import("@/features/clients-management/pages/ClientDetailPage"),
  "ClientDetailPage",
);

const TasksCalendarPage = lazyRoutePage(
  () => import("@/features/tasks/pages/TasksCalendarPage"),
  "TasksCalendarPage",
);

const RemindersManagementPage = lazyRoutePage(
  () => import("@/features/reminders/pages/RemindersManagementPage"),
  "RemindersManagementPage",
);

const NotificationsPage = lazyRoutePage(
  () => import("@/features/notifications/pages/NotificationsPage"),
  "NotificationsPage",
);

const AnalyticsPage = lazyRoutePage(
  () => import("@/features/analytics/pages/AnalyticsPage"),
  "AnalyticsPage",
);

const SettingsPage = lazyRoutePage(
  () => import("@/features/settings/pages/SettingsPage"),
  "SettingsPage",
);

function ProjectDetailLegacyRedirect() {
  const { id } = useParams();
  return (
    <Navigate to={`${ADMIN_PORTAL_PROJECTS_MANAGEMENT_PATH}/${id}`} replace />
  );
}

export const router = createBrowserRouter([
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
    path: "*",
    element: <LegacyPathRedirect />,
  },
]);
