import * as Notifications from "expo-notifications";
import type { DayOfWeek, Reminder } from "@types";

const REMINDER_PREFIX = "dayflow-reminder:";

const DAY_TO_WEEKDAY: Record<DayOfWeek, number> = {
  sun: 1,
  mon: 2,
  tue: 3,
  wed: 4,
  thu: 5,
  fri: 6,
  sat: 7,
};

function isReminderNotificationId(id: string): boolean {
  return id.startsWith(REMINDER_PREFIX);
}

export async function clearScheduledReminderNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => isReminderNotificationId(item.identifier))
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)),
  );
}

export async function scheduleLocalReminderNotifications(
  reminders: Reminder[],
): Promise<void> {
  await clearScheduledReminderNotifications();

  for (const reminder of reminders) {
    if (reminder.status === "paused" || reminder.status === "done") {
      continue;
    }

    const repeatDays =
      reminder.repeatDays && reminder.repeatDays.length > 0
        ? reminder.repeatDays
        : (["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as DayOfWeek[]);

    for (const day of repeatDays) {
      await Notifications.scheduleNotificationAsync({
        identifier: `${REMINDER_PREFIX}${reminder.id}:${day}`,
        content: {
          title: reminder.name,
          body: reminder.description ?? "Time for your reminder",
          data: { reminderId: reminder.id },
          categoryIdentifier: "custom_category",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: DAY_TO_WEEKDAY[day],
          hour: reminder.hour,
          minute: reminder.minute,
        },
      });
    }
  }
}
