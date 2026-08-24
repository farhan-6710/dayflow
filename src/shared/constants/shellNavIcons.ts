import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  CalendarClock,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Settings,
} from "lucide-react";

export type ShellNavIconKey =
  | "dashboard"
  | "tasks"
  | "projects"
  | "reminders"
  | "notifications"
  | "analytics"
  | "settings";

export const shellNavIcons: Record<ShellNavIconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  tasks: ListTodo,
  projects: FolderKanban,
  reminders: CalendarClock,
  notifications: Bell,
  analytics: BarChart3,
  settings: Settings,
};
