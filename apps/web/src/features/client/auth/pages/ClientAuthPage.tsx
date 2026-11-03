import {
  CLIENT_PORTAL_AUTH_PATH,
  CLIENT_PORTAL_DASHBOARD_PATH,
} from "@/app/constants/clientPortalRoutes";
import { AuthScreen } from "@/shared/auth/components/AuthScreen";
import type { AuthPortalConfig } from "@/shared/auth/types/components";

const config: AuthPortalConfig = {
  portal: "client",
  authPath: CLIENT_PORTAL_AUTH_PATH,
  homePath: CLIENT_PORTAL_DASHBOARD_PATH,
  illustration: "illo-auth-client",
  showDemoLogin: false,
  signInDescription: "Use the email on your client profile to continue.",
  signUpDescription: "Use the same email your provider has on file for you.",
  resetDescription: "Enter a new password for your client account.",
};

export function ClientAuthPage() {
  return <AuthScreen config={config} />;
}
