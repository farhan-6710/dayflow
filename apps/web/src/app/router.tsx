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
import { RouteErrorPage } from "@/shared/pages/RouteErrorPage";

// Stands in for every page until its phase replaces it; the title comes from the route `handle`.
const PlaceholderPage = lazyRoutePage(
  () => import("@/shared/pages/PlaceholderPage"),
  "PlaceholderPage",
);

const AuthPage = lazyRoutePage(
  () => import("@/features/workspace/auth/pages/AuthPage"),
  "AuthPage",
);
const SettingsPage = lazyRoutePage(
  () => import("@/features/workspace/settings/pages/SettingsPage"),
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
const ClientSettingsPage = lazyRoutePage(
  () => import("@/features/client/pages/ClientSettingsPage"),
  "ClientSettingsPage",
);
const OAuthCallbackPage = lazyRoutePage(
  () => import("@/shared/auth/pages/OAuthCallbackPage"),
  "OAuthCallbackPage",
);
const DesktopOAuthBridgePage = lazyRoutePage(
  () => import("@/shared/auth/pages/DesktopOAuthBridgePage"),
  "DesktopOAuthBridgePage",
);

function page(path: string, title: string) {
  return { path, handle: { title }, element: <PlaceholderPage /> };
}

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
              page("dashboard", "Dashboard"),
              page("tasks-calendar", "Tasks Calendar"),
              page("projects-management", "Projects Management"),
              page("projects-management/:id", "Project"),
              page("projects-management/:id/notes/:noteId", "Note"),
              page("clients-management", "Clients Management"),
              page("clients-management/:id", "Client"),
              page("daily-reminders", "Daily Reminders"),
              page("notifications", "Notifications"),
              page("analytics", "Analytics"),
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
              page("dashboard", "Dashboard"),
              page("projects", "Projects"),
              page("projects/:id", "Project"),
              page("notifications", "Notifications"),
              page("analytics", "Analytics"),
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
