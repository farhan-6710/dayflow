// Utility functions for home components

import { ReminderStatus } from "@types";
import { cn } from "@api/utils";
import { THEME_COLORS } from "@constants/theme";

export const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  const displayMinute = minute.toString().padStart(2, "0");
  return `${displayHour}:${displayMinute} ${period}`;
};

export const getCurrentTime = (): string => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  const displayMinute = minute.toString().padStart(2, "0");
  const displaySecond = second.toString().padStart(2, "0");

  return `${displayHour}:${displayMinute}:${displaySecond} ${period}`;
};

export const isReminderUpcoming = (status: ReminderStatus) => {
  return status === "upcoming";
};

export const getTimeUntilReminder = (hour: number, minute: number): string => {
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(hour, minute, 0, 0);

  // If reminder time has passed today, it's for tomorrow
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const timeDiff = reminderTime.getTime() - now.getTime();
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `in ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
  return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${
    minutes !== 1 ? "s" : ""
  }`;
};

export function getReminderClasses(status: string) {
  const s = String(status || "").toLowerCase();

  // Paused state uses neutral styling
  if (s === "paused") {
    return cn(
      "reminder relative flex flex-row items-center rounded-tr-3xl rounded-bl-3xl mb-3 box-border",
      "bg-card dark:bg-card-dark border border-border dark:border-slate-700"
    );
  }

  // Style by status
  if (s === "upcoming") {
    return cn(
      "reminder relative flex flex-row items-center rounded-tr-3xl rounded-bl-3xl mb-3 box-border",
      "bg-card dark:bg-card-dark border border-primary/40 dark:border-primary-dark/40"
    );
  }

  if (s === "missed") {
    return cn(
      "reminder relative flex flex-row items-center rounded-tr-3xl rounded-bl-3xl mb-3 box-border",
      "bg-white dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600/40"
    );
  }

  // default to done styling
  return cn(
    "reminder relative flex flex-row items-center rounded-tr-3xl rounded-bl-3xl mb-3 box-border",
    "bg-white dark:bg-emerald-900/30 border-2 border-emerald-400 dark:border-emerald-700/60"
  );
}

export function getLinearGradientColors(
  status: string,
  isDarkMode: boolean
): [string, string] {
  const s = String(status || "").toLowerCase();
  const theme = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  if (s === "paused") return theme.gradients.paused as [string, string];
  if (s === "upcoming") return theme.gradients.upcoming as [string, string];
  if (s === "missed") return theme.gradients.missed as [string, string];
  return theme.gradients.done as [string, string];
}

export function getReminderIconClasses(status: string) {
  const s = String(status || "").toLowerCase();
  const base =
    "reminder-icon w-12 h-12 rounded-2xl bg-background justify-center items-center";

  if (s === "paused") {
    return cn(
      base,
      "bg-background border dark:bg-card-dark border-border dark:border-slate-700"
    );
  }

  if (s === "upcoming") {
    return cn(
      base,
      "bg-primary/10 border border-primary/40 dark:bg-primary/20 dark:border-primary-dark"
    );
  }

  if (s === "missed") {
    return cn(
      base,
      "bg-rose-50 border border-rose-300 dark:bg-red-900/30 dark:border-red-400"
    );
  }

  // done
  return cn(
    base,
    "bg-green-50 border border-green-300 dark:bg-emerald-900/30 dark:border-emerald-300"
  );
}

export function getReminderIconColor(
  status: string,
  isDarkMode: boolean
): string {
  const s = String(status || "").toLowerCase();

  if (s === "paused") {
    return isDarkMode
      ? THEME_COLORS.neutral.gray
      : THEME_COLORS.neutral.grayDark;
  }

  if (s === "upcoming") {
    return isDarkMode ? THEME_COLORS.dark.primary : THEME_COLORS.light.primary;
  }
  if (s === "missed") return THEME_COLORS.status.error;
  return THEME_COLORS.status.success; // done
}

export function getReminderBadgeText(status: string): string {
  const s = String(status || "").toLowerCase();

  if (s === "paused") return "Paused";
  if (s === "upcoming") return "Upcoming";
  if (s === "missed") return "Missed";
  return "Done";
}

export function getReminderContentClasses(status: string): string {
  const s = String(status || "").toLowerCase();
  return cn("flex flex-row p-4");
}

export function getNotificationIconColor(isDarkMode: boolean): string {
  return isDarkMode ? "#60a5fa" : "#3b82f6"; // blue-400 : blue-500
}

export function getChevronIconColor(isDarkMode: boolean): string {
  return isDarkMode ? "#94a3b8" : "#64748b"; // slate-400 : slate-500
}
