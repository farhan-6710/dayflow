/** Base path for the DayFlow client workspace. */
export const CLIENT_PORTAL_PREFIX = "/client-portal";

export const CLIENT_PORTAL_AUTH_PATH = `${CLIENT_PORTAL_PREFIX}/auth`;
export const CLIENT_PORTAL_DASHBOARD_PATH = `${CLIENT_PORTAL_PREFIX}/dashboard`;
export const CLIENT_PORTAL_PROJECTS_PATH = `${CLIENT_PORTAL_PREFIX}/projects`;
export const CLIENT_PORTAL_NOTIFICATIONS_PATH = `${CLIENT_PORTAL_PREFIX}/notifications`;
export const CLIENT_PORTAL_ANALYTICS_PATH = `${CLIENT_PORTAL_PREFIX}/analytics`;
export const CLIENT_PORTAL_SETTINGS_PATH = `${CLIENT_PORTAL_PREFIX}/settings`;
export const CLIENT_PORTAL_NOT_A_CLIENT_PATH = `${CLIENT_PORTAL_PREFIX}/not-a-client`;

export function buildClientProjectDetailPath(projectId: string): string {
  return `${CLIENT_PORTAL_PROJECTS_PATH}/${projectId}`;
}
