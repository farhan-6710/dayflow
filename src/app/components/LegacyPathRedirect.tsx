import { Navigate, useLocation } from "react-router";

import { LEGACY_ADMIN_PORTAL_PREFIX } from "@/app/constants/adminPortalRoutes";
import {
  WORKSPACE_DASHBOARD_PATH,
  WORKSPACE_PREFIX,
} from "@/app/constants/workspaceRoutes";

/** Sends legacy unprefixed URLs (e.g. `/dashboard`) to their `/workspace/...` equivalent. */
export function LegacyPathRedirect() {
  const location = useLocation();

  if (location.pathname === "/") {
    return <Navigate to={WORKSPACE_DASHBOARD_PATH} replace />;
  }

  if (location.pathname.startsWith(LEGACY_ADMIN_PORTAL_PREFIX)) {
    const suffix = location.pathname.slice(LEGACY_ADMIN_PORTAL_PREFIX.length);
    return (
      <Navigate
        to={`${WORKSPACE_PREFIX}${suffix}${location.search}${location.hash}`}
        replace
      />
    );
  }

  return (
    <Navigate
      to={`${WORKSPACE_PREFIX}${location.pathname}${location.search}${location.hash}`}
      replace
    />
  );
}
