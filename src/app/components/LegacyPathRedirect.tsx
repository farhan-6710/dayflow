import { Navigate, useLocation } from "react-router";

import {
  ADMIN_PORTAL_DASHBOARD_PATH,
  ADMIN_PORTAL_PREFIX,
} from "@/app/constants/adminPortalRoutes";

/** Sends pre-prefix URLs (e.g. `/dashboard`) to their `/admin-portal/...` equivalent. */
export function LegacyPathRedirect() {
  const location = useLocation();

  if (location.pathname === "/") {
    return <Navigate to={ADMIN_PORTAL_DASHBOARD_PATH} replace />;
  }

  if (location.pathname.startsWith(ADMIN_PORTAL_PREFIX)) {
    return <Navigate to={ADMIN_PORTAL_DASHBOARD_PATH} replace />;
  }

  return (
    <Navigate
      to={`${ADMIN_PORTAL_PREFIX}${location.pathname}${location.search}${location.hash}`}
      replace
    />
  );
}
