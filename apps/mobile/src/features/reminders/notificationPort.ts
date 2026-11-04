import type { Reminder } from "@types";

/** The one place reminder screens touch notifications. Connected to the preserved scheduler in Phase 9. */
export async function syncReminderSchedule(_reminders: Reminder[]): Promise<void> {}

/** Applies the reminder alerts switch to what's scheduled. Connected in Phase 9. */
export async function syncReminderAlertsSetting(): Promise<void> {}
