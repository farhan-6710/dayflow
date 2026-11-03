import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  CalendarClock,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
} from "lucide-react";

export type ShellNavIconKey =
  | "dashboard"
  | "tasks"
  | "projects"
  | "clients"
  | "reminders"
  | "notifications"
  | "analytics"
  | "settings";

export const shellNavIcons: Record<ShellNavIconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  tasks: ListTodo,
  projects: FolderKanban,
  clients: Users,
  reminders: CalendarClock,
  notifications: Bell,
  analytics: BarChart3,
  settings: Settings,
};
