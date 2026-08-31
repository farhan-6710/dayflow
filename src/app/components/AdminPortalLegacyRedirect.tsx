import { Navigate, useLocation } from "react-router";

import { LEGACY_ADMIN_PORTAL_PREFIX } from "@/app/constants/adminPortalRoutes";
import { WORKSPACE_PREFIX } from "@/app/constants/workspaceRoutes";

/** Redirects `/admin-portal/*` bookmarks to `/workspace/*`. */
export function AdminPortalLegacyRedirect() {
  const location = useLocation();
  const suffix = location.pathname.slice(LEGACY_ADMIN_PORTAL_PREFIX.length);

  return (
    <Navigate
      to={`${WORKSPACE_PREFIX}${suffix}${location.search}${location.hash}`}
      replace
    />
  );
}
