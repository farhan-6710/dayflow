import { CLIENT_PORTAL_AUTH_PATH, CLIENT_PORTAL_SETTINGS_PATH } from "@/app/constants/clientPortalRoutes";
import { SettingsView } from "@/shared/settings/components/SettingsView";

export function ClientSettingsPage() {
  return <SettingsView settingsPath={CLIENT_PORTAL_SETTINGS_PATH} authPath={CLIENT_PORTAL_AUTH_PATH} />;
}
