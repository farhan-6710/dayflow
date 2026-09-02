import { DayOfWeek, ReminderStatus, ReminderCategory } from "@types";

// Days of the week constant
export const DAYS_OF_WEEK: DayOfWeek[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

// Status options constant
export const REMINDER_STATUSES: ReminderStatus[] = [
  "upcoming",
  "done",
  "missed",
  "paused",
];

export const REMINDER_CATEGORIES: ReminderCategory[] = [
  "health",
  "fitness",
  "work",
  "personal",
];

/**
 * Human-readable labels for reminder categories
 */
export const REMINDER_CATEGORY_LABELS: Record<ReminderCategory, string> = {
  health: "Health",
  fitness: "Fitness",
  work: "Work",
  personal: "Personal",
};
