export const PROJECTS_MANAGEMENT_PATH = "/projects-management";

export function buildProjectDetailPath(projectId: string): string {
  return `${PROJECTS_MANAGEMENT_PATH}/${projectId}`;
}

export function buildProjectNotePath(
  projectId: string,
  noteId: string,
): string {
  return `${PROJECTS_MANAGEMENT_PATH}/${projectId}/notes/${noteId}`;
}
