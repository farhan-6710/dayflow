import { formatTimeLabel } from "@utils/timePickerUtils";

export const HOUR_12_OPTIONS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1),
);

export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);

export const PERIOD_OPTIONS = ["AM", "PM"] as const;

function buildReminderQuickTimes(): string[] {
  const times: string[] = [];
  for (let hour = 6; hour <= 23; hour += 1) {
    times.push(formatTimeLabel(hour, 0));
    if (hour < 23) {
      times.push(formatTimeLabel(hour, 30));
    }
  }
  return times;
}

/** Same 30-minute slots as the web workspace reminder/time pickers. */
export const REMINDER_QUICK_TIMES = buildReminderQuickTimes();

export const PICKER_WHEEL_ITEM_HEIGHT = 44;
export const PICKER_WHEEL_VISIBLE_ROWS = 5;
