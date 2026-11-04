import { Platform } from "react-native";

import { getReminderAlertsEnabled } from "@/features/settings/notificationPrefs";
import { queryClient } from "@/lib/query";
import { clearScheduledReminderNotifications, scheduleLocalReminderNotifications } from "@services/localReminderScheduler";
import type { Reminder } from "@types";

const supported = Platform.OS !== "web";

/**
 * The one place reminder screens touch notifications. The preserved scheduler skips "done" so it
 * doesn't fire twice, but it also drops that reminder's whole week. Status only tracks today, so
 * "done" goes in as "upcoming": today's time has already passed, and later days still fire.
 */
export async function syncReminderSchedule(reminders: Reminder[]): Promise<void> {
  if (!supported) return;
  if (!(await getReminderAlertsEnabled())) {
    await clearScheduledReminderNotifications();
    return;
  }
  await scheduleLocalReminderNotifications(reminders.map((reminder) => (reminder.status === "done" ? { ...reminder, status: "upcoming" as const } : reminder)));
}

/** Applies the reminder alerts switch by reloading, which reschedules or clears. */
export async function syncReminderAlertsSetting(): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: ["reminders"] });
}

/** After sign-out this phone shouldn't alert for that account. */
export async function clearReminderSchedule(): Promise<void> {
  if (supported) await clearScheduledReminderNotifications();
}
