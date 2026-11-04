import {
  WORKSPACE_DASHBOARD_PATH,
  WORKSPACE_PROJECTS_MANAGEMENT_PATH,
  WORKSPACE_SETTINGS_PATH,
  WORKSPACE_TASKS_CALENDAR_PATH,
} from "@/app/constants/workspaceRoutes";
import { AccountView } from "@/shared/settings/components/AccountView";

export function AccountPage() {
  return (
    <AccountView
      roleLabel="Workspace owner"
      homePath={WORKSPACE_DASHBOARD_PATH}
      tasksPath={WORKSPACE_TASKS_CALENDAR_PATH}
      projectsPath={WORKSPACE_PROJECTS_MANAGEMENT_PATH}
      settingsPath={WORKSPACE_SETTINGS_PATH}
    />
  );
}
