import { createBrowserRouter, Navigate, useParams } from "react-router";

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
  return <Navigate to={`/projects-management/${id}`} replace />;
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: "/auth",
        element: <AuthPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/projects-management",
            element: <ProjectsManagementPage />,
          },
          {
            path: "/projects-management/:id/notes/:noteId",
            element: <ProjectNotePage />,
          },
          {
            path: "/projects-management/:id",
            element: <ProjectDetailPage />,
          },
          {
            path: "/projects",
            element: <Navigate to="/projects-management" replace />,
          },
          {
            path: "/projects/:id",
            element: <ProjectDetailLegacyRedirect />,
          },
          {
            path: "/clients-management",
            element: <ClientsManagementPage />,
          },
          {
            path: "/clients",
            element: <Navigate to="/clients-management" replace />,
          },
          {
            path: "/tasks",
            element: <Navigate to="/tasks-calendar" replace />,
          },
          {
            path: "/tasks-calendar",
            element: <TasksCalendarPage />,
          },
          {
            path: "/calendar",
            element: <Navigate to="/tasks-calendar" replace />,
          },
          {
            path: "/daily-reminders",
            element: <RemindersManagementPage />,
          },
          {
            path: "/reminders",
            element: <Navigate to="/daily-reminders" replace />,
          },
          {
            path: "/notifications",
            element: <NotificationsPage />,
          },
          {
            path: "/analytics",
            element: <AnalyticsPage />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
          {
            path: "*",
            element: <Navigate to="/dashboard" replace />,
          },
        ],
      },
    ],
  },
]);
