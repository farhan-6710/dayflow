import type { ReactNode } from "react";

export type SettingsViewProps = {
  /** This portal's settings route; the email-change link returns here. */
  settingsPath: string;
  /** This portal's auth route; the password-reset link returns here. */
  authPath: string;
};

export type SettingsCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export type EmailCardProps = {
  settingsPath: string;
};

export type PasswordCardProps = {
  authPath: string;
};
