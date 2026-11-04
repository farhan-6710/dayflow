import {
  CLIENT_PORTAL_DASHBOARD_PATH,
  CLIENT_PORTAL_PROJECTS_PATH,
  CLIENT_PORTAL_SETTINGS_PATH,
} from "@/app/constants/clientPortalRoutes";
import { AccountView } from "@/shared/settings/components/AccountView";

export function ClientAccountPage() {
  return (
    <AccountView
      roleLabel="Client portal"
      homePath={CLIENT_PORTAL_DASHBOARD_PATH}
      tasksPath={CLIENT_PORTAL_PROJECTS_PATH}
      projectsPath={CLIENT_PORTAL_PROJECTS_PATH}
      settingsPath={CLIENT_PORTAL_SETTINGS_PATH}
    />
  );
}
