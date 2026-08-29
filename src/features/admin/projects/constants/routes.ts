import { ADMIN_PORTAL_PROJECTS_MANAGEMENT_PATH } from "@/app/constants/adminPortalRoutes";

export const PROJECTS_MANAGEMENT_PATH = ADMIN_PORTAL_PROJECTS_MANAGEMENT_PATH;

export function buildProjectDetailPath(projectId: string): string {
  return `${PROJECTS_MANAGEMENT_PATH}/${projectId}`;
}

export function buildProjectNotePath(
  projectId: string,
  noteId: string,
): string {
  return `${PROJECTS_MANAGEMENT_PATH}/${projectId}/notes/${noteId}`;
}

export function buildProjectPath(projectId: string): string {
  return buildProjectDetailPath(projectId);
}
