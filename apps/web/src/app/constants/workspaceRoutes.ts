/** Base path for the DayFlow workspace (main app). */
export const WORKSPACE_PREFIX = "/workspace";

export const WORKSPACE_AUTH_PATH = `${WORKSPACE_PREFIX}/auth`;
export const WORKSPACE_DASHBOARD_PATH = `${WORKSPACE_PREFIX}/dashboard`;
export const WORKSPACE_TASKS_CALENDAR_PATH = `${WORKSPACE_PREFIX}/tasks-calendar`;
export const WORKSPACE_PROJECTS_MANAGEMENT_PATH = `${WORKSPACE_PREFIX}/projects-management`;
export const WORKSPACE_CLIENTS_MANAGEMENT_PATH = `${WORKSPACE_PREFIX}/clients-management`;
export const WORKSPACE_DAILY_REMINDERS_PATH = `${WORKSPACE_PREFIX}/daily-reminders`;
export const WORKSPACE_NOTIFICATIONS_PATH = `${WORKSPACE_PREFIX}/notifications`;
export const WORKSPACE_ANALYTICS_PATH = `${WORKSPACE_PREFIX}/analytics`;
export const WORKSPACE_ACCOUNT_PATH = `${WORKSPACE_PREFIX}/account`;
export const WORKSPACE_SETTINGS_PATH = `${WORKSPACE_PREFIX}/settings`;

export function buildProjectPath(projectId: string): string {
  return `${WORKSPACE_PROJECTS_MANAGEMENT_PATH}/${projectId}`;
}

/** `noteId` "new" opens the editor on an unsaved draft. */
export function buildProjectNotePath(projectId: string, noteId: string): string {
  return `${buildProjectPath(projectId)}/notes/${noteId}`;
}

export function buildClientPath(clientId: string): string {
  return `${WORKSPACE_CLIENTS_MANAGEMENT_PATH}/${clientId}`;
}
