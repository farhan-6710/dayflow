import { WORKSPACE_AUTH_PATH, WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { AuthScreen } from "@/shared/auth/components/AuthScreen";
import type { AuthPortalConfig } from "@/shared/auth/types/components";
import { BRAND_NAME } from "@/shared/brand/brandManifest";

const config: AuthPortalConfig = {
  portal: "workspace",
  authPath: WORKSPACE_AUTH_PATH,
  homePath: WORKSPACE_DASHBOARD_PATH,
  illustration: "illo-auth-workspace",
  showDemoLogin: true,
  signInDescription: "Use your email and password to open your workspace.",
  signUpDescription: "Add your name, email and a password to get started.",
  resetDescription: `Enter a new password for your ${BRAND_NAME} account.`,
};

export function AuthPage() {
  return <AuthScreen config={config} />;
}
