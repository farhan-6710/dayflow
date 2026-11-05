import { ReminderCard } from "@/features/workspace/reminders/components/ReminderCard";
import type { RemindersGridProps } from "@/features/workspace/reminders/types/components";
import { byTime } from "@/features/workspace/reminders/utils/reminderSchedule";
import { Phantom } from "@/shared/components/Phantom";
import type { Reminder } from "@/shared/types/types";

const noop = () => undefined;

/** Stand-ins that give the skeleton the shape of real cards. */
const PLACEHOLDERS: Reminder[] = ["1", "2", "3", "4"].map((id) => ({
  id,
  user_id: "",
  title: "Weekly client check-in",
  description: "A short note about this reminder",
  reminder_time: "10:00 AM",
  days_of_week: ["mon", "wed", "fri"],
  is_disabled: false,
  disabled_until: null,
  created_at: "",
  updated_at: "",
}));

/** Two cards a row above 640px, one below. Earliest time first. */
export function RemindersGrid({ reminders, isLoading, onEdit, onDelete }: RemindersGridProps) {
  const grid = (
    <div className="grid min-w-0 grid-cols-1 gap-3 min-[641px]:grid-cols-2 sm:gap-4">
      {(isLoading ? PLACEHOLDERS : [...reminders].sort(byTime)).map((reminder) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          onEdit={isLoading ? noop : onEdit}
          onDelete={isLoading ? noop : onDelete}
        />
      ))}
    </div>
  );

  return isLoading ? <Phantom>{grid}</Phantom> : grid;
}
