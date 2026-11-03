import type { ReactNode } from "react";

import type { BrandPortalKey } from "@/shared/brand/brandManifest";
import type { DayflowImageName } from "@/shared/constants/dayflowImages";

/** What differs between the workspace and client-portal auth screens. */
export type AuthPortalConfig = {
  portal: BrandPortalKey;
  authPath: string;
  homePath: string;
  illustration: DayflowImageName;
  showDemoLogin: boolean;
  signInDescription: string;
  signUpDescription: string;
  resetDescription: string;
};

export type AuthScreenProps = {
  config: AuthPortalConfig;
};

export type AuthShellLayoutProps = {
  config: AuthPortalConfig;
  children: ReactNode;
};

export type AuthBrandPanelProps = {
  config: AuthPortalConfig;
};

export type AuthFormAlertProps = {
  message: string;
  variant: "error" | "success" | "info";
};

export type AuthOAuthSignInProps = {
  disabled?: boolean;
  redirectPath: string;
  onError: (message: string) => void;
  onBeforeSignIn: () => void;
};

export type LoginFormProps = {
  authPath: string;
  homePath: string;
  showDemoLogin: boolean;
};

export type SignupFormProps = {
  homePath: string;
};

export type ForgotPasswordFormProps = {
  authPath: string;
};

export type ResetPasswordFormProps = {
  homePath: string;
};
