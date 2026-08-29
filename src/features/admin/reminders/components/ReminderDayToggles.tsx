import {
  REMINDER_DAY_OPTIONS,
} from "@/features/admin/reminders/constants/remindersCalendar";
import type { ReminderDayTogglesProps } from "@/features/admin/reminders/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

const ALL_DAY_KEYS = REMINDER_DAY_OPTIONS.map((day) => day.key);

export function ReminderDayToggles({
  selectedDays,
  onChange,
  disabled = false,
}: ReminderDayTogglesProps) {
  const allSelected = ALL_DAY_KEYS.every((key) => selectedDays.includes(key));

  function toggleDay(dayKey: string) {
    if (selectedDays.includes(dayKey)) {
      onChange(selectedDays.filter((key) => key !== dayKey));
      return;
    }
    onChange([...selectedDays, dayKey]);
  }

  function toggleAllDays() {
    onChange(allSelected ? [] : [...ALL_DAY_KEYS]);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {REMINDER_DAY_OPTIONS.map((day) => {
        const isSelected = selectedDays.includes(day.key);
        return (
          <Button
            key={day.key}
            type="button"
            size="sm"
            variant={isSelected ? "default" : "outline"}
            disabled={disabled}
            aria-pressed={isSelected}
            className={cn("size-9 rounded-full p-0 font-semibold")}
            onClick={() => toggleDay(day.key)}
          >
            {day.initial}
          </Button>
        );
      })}
      <Button
        type="button"
        size="sm"
        variant={allSelected ? "default" : "outline"}
        disabled={disabled}
        aria-pressed={allSelected}
        className="rounded-full px-3"
        onClick={toggleAllDays}
      >
        All days
      </Button>
    </div>
  );
}
