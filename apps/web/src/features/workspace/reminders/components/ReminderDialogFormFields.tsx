import { ReminderDayToggles } from "@/features/workspace/reminders/components/ReminderDayToggles";
import { ReminderTimeSelect } from "@/features/workspace/reminders/components/ReminderTimeSelect";
import type { ReminderDialogProps } from "@/features/workspace/reminders/types/components";
import { DatePicker } from "@/shared/components/DatePicker";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";

export function ReminderDialogFormFields({
  values,
  onFieldChange,
  submitting,
}: Pick<ReminderDialogProps, "values" | "onFieldChange" | "submitting">) {
  return (
    <div className="space-y-4 py-2">
      <div className={formFieldGroupClassName}>
        <Label htmlFor="reminder-title" className={formLabelClassName}>Title</Label>
        <Input
          id="reminder-title"
          value={values.title}
          onChange={(event) => onFieldChange("title", event.target.value)}
          placeholder="Reminder title"
          disabled={submitting}
          required
        />
      </div>

      <div className={formFieldGroupClassName}>
        <Label htmlFor="reminder-description" className={formLabelClassName}>Description</Label>
        <Input
          id="reminder-description"
          value={values.description}
          onChange={(event) => onFieldChange("description", event.target.value)}
          placeholder="Optional details"
          disabled={submitting}
        />
      </div>

      <div className={formFieldGroupClassName}>
        <Label className={formLabelClassName}>Time</Label>
        <ReminderTimeSelect
          selectedTime={values.reminderTime}
          summaryLabel={`Reminder at ${values.reminderTime}`}
          listLabel="Reminder times"
          disabled={submitting}
          onTimeChange={(time) => onFieldChange("reminderTime", time)}
        />
      </div>

      <div className={formFieldGroupClassName}>
        <Label className={formLabelClassName}>Days</Label>
        <ReminderDayToggles
          selectedDays={values.daysOfWeek}
          disabled={submitting}
          onChange={(days) => onFieldChange("daysOfWeek", days)}
        />
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="reminder-disabled" className={formLabelClassName}>Disable reminder</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pause this reminder for now or for a specific period.
            </p>
          </div>
          <Switch
            id="reminder-disabled"
            checked={values.isDisabled}
            disabled={submitting}
            onCheckedChange={(checked) => onFieldChange("isDisabled", checked)}
          />
        </div>

        {values.isDisabled ? (
          <div className={formFieldGroupClassName}>
            <Label className={formLabelClassName}>Disabled until (optional)</Label>
            <DatePicker
              value={values.disabledUntil}
              onChange={(nextDate) => onFieldChange("disabledUntil", nextDate)}
              disabled={submitting}
              clearable
              onClear={() => onFieldChange("disabledUntil", "")}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to keep it disabled until you turn it back on.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
