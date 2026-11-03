import { useEffect, useRef } from "react";

import { dayKeyForDate, isReminderActive, parseTimeToMinutes } from "@/features/workspace/reminders/utils/reminderSchedule";
import { createNotification } from "@/services/notificationsService";
import { fetchReminders, hasReminderNotificationToday } from "@/services/remindersService";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Reminder } from "@/shared/types/types";
import { serializeDateValue } from "@/shared/utils/dateValue";
import { showToast } from "@/shared/utils/showToast";

const CHECK_INTERVAL_MS = 60_000;

/**
 * Creates reminder notifications from the browser (the database stays unchanged, so
 * there is no server job). Runs across the whole workspace while a tab is open.
 */
export function useReminderAlerts() {
  const { user } = useAuth();
  const userId = user?.id;
  const sentRef = useRef(new Set<string>());

  useEffect(() => {
    if (!userId) {
      return;
    }
    const currentUserId = userId;

    async function alertIfDue(reminder: Reminder, dayStamp: string) {
      const sentKey = `${reminder.id}:${dayStamp}`;
      if (sentRef.current.has(sentKey) || (await hasReminderNotificationToday(currentUserId, reminder.id))) {
        sentRef.current.add(sentKey);
        return;
      }
      sentRef.current.add(sentKey);
      await createNotification({
        userId: currentUserId,
        notificationType: "reminder",
        title: reminder.title,
        message: reminder.description?.trim() || `Reminder at ${reminder.reminder_time}.`,
        relatedId: reminder.id,
      });
      showToast("info", `Reminder: ${reminder.title}`, { description: `Set for ${reminder.reminder_time}` });
    }

    async function check() {
      try {
        const now = new Date();
        const minutes = now.getHours() * 60 + now.getMinutes();
        const reminders = await fetchReminders(currentUserId);
        const due = reminders.filter((reminder) => {
          const at = parseTimeToMinutes(reminder.reminder_time);
          return (
            at !== null &&
            Math.abs(minutes - at) <= 1 &&
            reminder.days_of_week.includes(dayKeyForDate(now)) &&
            isReminderActive(reminder, now)
          );
        });
        await Promise.all(due.map((reminder) => alertIfDue(reminder, serializeDateValue(now))));
      } catch (error) {
        // Quiet by design: a background check must not interrupt the user. It retries next minute.
        console.error("Reminder check failed:", error);
      }
    }

    void check();
    const intervalId = window.setInterval(() => void check(), CHECK_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [userId]);
}
