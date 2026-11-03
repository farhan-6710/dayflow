import { Navigate, useParams } from "react-router";

import { WORKSPACE_PROJECTS_MANAGEMENT_PATH } from "@/app/constants/workspaceRoutes";

export function LegacyProjectRedirect() {
  const { id } = useParams();
  return <Navigate to={`${WORKSPACE_PROJECTS_MANAGEMENT_PATH}/${id}`} replace />;
}
