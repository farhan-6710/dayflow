import { WORKSPACE_AUTH_PATH, WORKSPACE_SETTINGS_PATH } from "@/app/constants/workspaceRoutes";
import { SettingsView } from "@/shared/settings/components/SettingsView";

export function SettingsPage() {
  return <SettingsView settingsPath={WORKSPACE_SETTINGS_PATH} authPath={WORKSPACE_AUTH_PATH} />;
}
