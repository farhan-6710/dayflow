import { Reminder, DayOfWeek, ReminderStatus, ReminderCategory } from "@types";

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

export const DUMMY_REMINDERS_LIST: Reminder[] = [
  {
    id: "temp_1",
    name: "Wake Up",
    description: "Start your day with energy",
    hour: 9,
    minute: 0,
    displayTime: "09:00 AM",
    status: "done",
    category: "health",
    repeatDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  },
  {
    id: "temp_2",
    name: "Lunch Time",
    description: "Time for a healthy meal",
    hour: 15,
    minute: 0,
    displayTime: "03:00 PM",
    status: "missed",
    category: "health",
    repeatDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  },
  {
    id: "temp_3",
    name: "Workout Time",
    description: "Exercise for 30 minutes",
    hour: 19,
    minute: 0,
    displayTime: "07:00 PM",
    status: "upcoming",
    category: "fitness",
    repeatDays: ["mon", "tue", "wed", "thu", "fri"],
  },
  {
    id: "temp_4",
    name: "Go To Sleep",
    description: "Get your beauty sleep",
    hour: 23,
    minute: 0,
    displayTime: "11:00 PM",
    status: "upcoming",
    category: "personal",
    repeatDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  },
];

const generateReminders = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const total = Math.floor(Math.random() * 10) + 5;
    const checked = Math.floor(Math.random() * (total + 1));

    return {
      id: i + 1,
      remindersChecked: checked,
      totalReminders: total,
      date: date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  });
};

export const REMINDERS_HISTORY = generateReminders(100);
