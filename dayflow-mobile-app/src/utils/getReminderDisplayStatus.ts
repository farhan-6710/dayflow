import { DisplayReminderStatus, ReminderStatus } from "@/types";

/**
 * Calculates the display status for a reminder based on its DB status and scheduled time
 *
 * Logic:
 * - DB status "done" → Display "done"
 * - DB status "paused" → Display "paused"
 * - DB status "upcoming" + time passed → Display "missed"
 * - DB status "upcoming" + time not passed → Display "upcoming"
 *
 * @param dbStatus - The status stored in the database
 * @param hour - Scheduled hour (0-23)
 * @param minute - Scheduled minute (0-59)
 * @param repeatDays - Optional array of repeat days (for recurring reminders)
 * @returns The status to display in the UI
 */
export const getReminderDisplayStatus = (
  dbStatus: ReminderStatus,
  hour: number,
  minute: number,
  repeatDays?: string[]
): DisplayReminderStatus => {
  // If status is "done", "paused", or "missed", return as-is
  if (dbStatus === "done" || dbStatus === "paused" || dbStatus === "missed") {
    return dbStatus;
  }

  // For "upcoming" status, check if the time has passed
  // Use device's local time (should be set to IST)
  const now = new Date();
  const currentHour = now.getHours(); // Local time hours
  const currentMinute = now.getMinutes(); // Local time minutes

  console.log(
    `Current time: ${currentHour}:${currentMinute}, Reminder: ${hour}:${minute}, RepeatDays:`,
    repeatDays
  );

  // For recurring reminders (has repeatDays)
  if (repeatDays && repeatDays.length > 0) {
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayMap: { [key: number]: string } = {
      0: "sun",
      1: "mon",
      2: "tue",
      3: "wed",
      4: "thu",
      5: "fri",
      6: "sat",
    };
    const todayKey = dayMap[currentDay];

    console.log(
      `Today is: ${todayKey}, RepeatDays includes today:`,
      repeatDays.includes(todayKey)
    );

    // If today is a repeat day
    if (repeatDays.includes(todayKey)) {
      const timePassed =
        currentHour > hour || (currentHour === hour && currentMinute > minute);
      console.log(
        `Time passed check: ${currentHour} > ${hour} || (${currentHour} === ${hour} && ${currentMinute} > ${minute}) = ${timePassed}`
      );

      // Check if the time has passed today
      if (timePassed) {
        console.log(`Returning: missed`);
        return "missed";
      }
      console.log(`Returning: upcoming (time not passed yet today)`);
      return "upcoming";
    }
    // If today is not a repeat day, it's upcoming (waiting for next repeat day)
    console.log(`Returning: upcoming (not a repeat day)`);
    return "upcoming";
  }

  // For one-time reminders (no repeatDays)
  // Check if the time has passed
  const timePassed =
    currentHour > hour || (currentHour === hour && currentMinute > minute);
  console.log(
    `One-time reminder - Time passed: ${timePassed}, Returning:`,
    timePassed ? "missed" : "upcoming"
  );

  if (timePassed) {
    return "missed";
  }

  return "upcoming";
};
