import { Navigate, useLocation } from "react-router";

import { LEGACY_ADMIN_PORTAL_PREFIX } from "@/app/constants/legacyRoutes";
import { WORKSPACE_PREFIX } from "@/app/constants/workspaceRoutes";

/** Sends `/admin-portal/*` and unprefixed URLs to their `/workspace` equivalent. `/` is the website. */
export function LegacyPathRedirect() {
  const { pathname, search, hash } = useLocation();

  const suffix = pathname.startsWith(LEGACY_ADMIN_PORTAL_PREFIX)
    ? pathname.slice(LEGACY_ADMIN_PORTAL_PREFIX.length)
    : pathname;

  return <Navigate to={`${WORKSPACE_PREFIX}${suffix}${search}${hash}`} replace />;
}
