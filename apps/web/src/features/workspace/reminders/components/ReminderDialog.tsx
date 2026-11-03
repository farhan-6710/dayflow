import type { ReminderDialogProps, ReminderFormValues } from "@/features/workspace/reminders/types/components";
import { REMINDER_DAYS } from "@/features/workspace/reminders/utils/reminderSchedule";
import { DatePicker } from "@/shared/components/DatePicker";
import { FormDialog } from "@/shared/components/FormDialog";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { TextField } from "@/shared/components/TextField";
import { TimeSelect } from "@/shared/components/TimeSelect";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import { DEFAULT_TIME } from "@/shared/constants/times";
import { useDialogForm } from "@/shared/hooks/useDialogForm";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";

export function ReminderDialog({ open, onOpenChange, reminder, defaultDay, onSave, onDelete }: ReminderDialogProps) {
  const initialValues: ReminderFormValues = {
    title: reminder?.title ?? "",
    description: reminder?.description ?? "",
    reminderTime: reminder?.reminder_time ?? DEFAULT_TIME,
    daysOfWeek: reminder?.days_of_week ?? [defaultDay],
    isDisabled: reminder?.is_disabled ?? false,
    disabledUntil: reminder?.disabled_until ?? "",
  };
  const form = useDialogForm({
    id: "reminder-dialog",
    open,
    onOpenChange,
    isCreate: !reminder,
    initialValues,
    canSave: (values) => values.title.trim().length > 0 && values.daysOfWeek.length > 0,
    save: (values) => onSave(reminder?.id ?? null, values),
  });
  const { values, setField, saving } = form;

  return (
    <FormDialog
      open={open}
      title={reminder ? "Edit reminder" : "New reminder"}
      description="A nudge that repeats on the days you choose."
      submitLabel={reminder ? "Save reminder" : "Add reminder"}
      saving={saving}
      canSave={form.canSubmit}
      onOpenChange={form.handleOpenChange}
      onSubmit={form.handleSubmit}
    >
      <TextField
        id="reminder-title"
        label="Title"
        value={values.title}
        onChange={(title) => setField("title", title)}
        disabled={saving}
        required
      />
      <TextAreaField
        id="reminder-description"
        label="Description (optional)"
        value={values.description}
        onChange={(description) => setField("description", description)}
        disabled={saving}
      />
      <TimeSelect
        label="Time"
        value={values.reminderTime}
        onChange={(time) => setField("reminderTime", time)}
        disabled={saving}
      />
      <div className={formFieldGroupClassName}>
        <span className={formLabelClassName}>Repeat on</span>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Repeat on">
          {REMINDER_DAYS.map((day) => {
            const selected = values.daysOfWeek.includes(day.key);
            return (
              <button
                key={day.key}
                type="button"
                aria-pressed={selected}
                disabled={saving}
                onClick={() =>
                  setField(
                    "daysOfWeek",
                    selected ? values.daysOfWeek.filter((key) => key !== day.key) : [...values.daysOfWeek, day.key],
                  )
                }
                className={cn(
                  "h-10 min-w-11 rounded-lg border border-border px-2 text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  selected ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent",
                )}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex min-h-10 items-center justify-between gap-4">
        <label htmlFor="reminder-disabled" className="text-sm">
          Turn off for now
        </label>
        <Switch
          id="reminder-disabled"
            className="relative after:absolute after:-inset-3"
          checked={values.isDisabled}
          disabled={saving}
          onCheckedChange={(checked) => setField("isDisabled", checked)}
        />
      </div>
      {values.isDisabled ? (
        <DatePicker
          id="reminder-disabled-until"
          label="Off until (optional)"
          placeholder="Until you turn it back on"
          value={values.disabledUntil}
          onChange={(date) => setField("disabledUntil", date)}
          onClear={() => setField("disabledUntil", "")}
          disabled={saving}
        />
      ) : null}
      {reminder ? (
        <Button
          type="button"
          variant="ghost"
          className="h-10 justify-start px-0 underline underline-offset-4 hover:bg-transparent"
          disabled={saving}
          onClick={() => onDelete(reminder)}
        >
          Delete this reminder
        </Button>
      ) : null}
    </FormDialog>
  );
}
