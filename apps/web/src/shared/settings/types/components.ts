import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { UserSettingKey } from "@/shared/types/types";

export type SettingsViewProps = {
  /** This portal's settings route; the email-change link returns here. */
  settingsPath: string;
  /** This portal's auth route; the password-reset link returns here. */
  authPath: string;
};

export type SettingsCardProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
};

export type PreferenceToggleRowProps = {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export type UserSettingToggleRowProps = {
  settingKey: UserSettingKey;
};

export type EmailCardProps = {
  settingsPath: string;
};

export type PasswordCardProps = {
  authPath: string;
};

export type AccountViewProps = {
  settingsPath: string;
  homePath: string;
  tasksPath: string;
  projectsPath: string;
  roleLabel: string;
};
