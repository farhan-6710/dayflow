import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { CATEGORY_OPTIONS, DAYS, todayKey } from "@/features/reminders/reminderMeta";
import { useReminderActions } from "@/features/reminders/useReminders";
import { parseTimeLabel } from "@/lib/time";
import { DEFAULT_TIME } from "@/shared/constants/times";
import { formatReminderTime } from "@/services/reminderMapper";
import { Chip } from "@/ui/Chip";
import { ChipGroup } from "@/ui/ChipGroup";
import { DateField } from "@/ui/DateField";
import { FormSheet } from "@/ui/FormSheet";
import { Input } from "@/ui/Input";
import { SwitchRow } from "@/ui/SwitchRow";
import { Text } from "@/ui/Text";
import { TimeField } from "@/ui/TimeField";
import type { DayOfWeek, Reminder, ReminderCategory } from "@types";

type ReminderFormSheetProps = {
  open: boolean;
  onClose: () => void;
  reminder?: Reminder | null;
};

function initialState(reminder?: Reminder | null) {
  return {
    title: reminder?.name ?? "",
    description: reminder?.description ?? "",
    time: reminder?.displayTime ?? DEFAULT_TIME,
    days: reminder?.repeatDays?.length ? reminder.repeatDays : [todayKey()],
    category: (reminder?.category ?? "none") as ReminderCategory | "none",
    paused: reminder?.status === "paused",
    disabledUntil: reminder?.disabledUntil ?? null,
  };
}

export function ReminderFormSheet({ open, onClose, reminder }: ReminderFormSheetProps) {
  const { create, update } = useReminderActions();
  const initial = useMemo(() => initialState(reminder), [reminder]);
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (open) setForm(initial);
  }, [open, initial]);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  function toggleDay(day: DayOfWeek) {
    setForm({ ...form, days: form.days.includes(day) ? form.days.filter((item) => item !== day) : [...form.days, day] });
  }

  async function submit() {
    const parsed = parseTimeLabel(form.time) ?? { hour: 9, minute: 0 };
    const values = {
      name: form.title.trim(),
      description: form.description.trim() || undefined,
      hour: parsed.hour,
      minute: parsed.minute,
      displayTime: formatReminderTime(parsed.hour, parsed.minute),
      repeatDays: form.days,
      category: form.category === "none" ? undefined : form.category,
      disabledUntil: form.paused ? form.disabledUntil : null,
    };
    if (reminder) {
      const status = form.paused ? "paused" : reminder.status === "paused" ? "upcoming" : reminder.status;
      await update.mutateAsync({ id: reminder.id, updates: { ...values, status } });
    } else {
      await create.mutateAsync({ ...values, status: form.paused ? "paused" : "upcoming" });
    }
  }

  return (
    <FormSheet
      open={open}
      onClose={onClose}
      title={reminder ? "Edit reminder" : "New reminder"}
      submitLabel={reminder ? "Save reminder" : "Add reminder"}
      onSubmit={submit}
      dirty={dirty}
      canSubmit={Boolean(form.title.trim()) && form.days.length > 0}
    >
      <Input label="Title" value={form.title} onChangeText={(title) => setForm({ ...form, title })} placeholder="What should we remind you of?" autoFocus={!reminder} />
      <Input label="Description" value={form.description} onChangeText={(description) => setForm({ ...form, description })} multiline placeholder="Add details (optional)" />
      <TimeField label="Time" value={form.time} onChange={(time) => setForm({ ...form, time: time ?? DEFAULT_TIME })} />
      <View className="gap-1.5">
        <Text variant="label">Repeat on</Text>
        <View className="flex-row flex-wrap gap-2">
          {DAYS.map((day) => (
            <Chip key={day.key} label={day.short} selected={form.days.includes(day.key)} onPress={() => toggleDay(day.key)} />
          ))}
        </View>
        {form.days.length === 0 ? (
          <Text variant="caption">Choose at least one day.</Text>
        ) : null}
      </View>
      <ChipGroup label="Category" options={CATEGORY_OPTIONS} value={form.category} onChange={(category) => setForm({ ...form, category })} />
      <SwitchRow label="Pause this reminder" description="No alerts while paused." value={form.paused} onChange={(paused) => setForm({ ...form, paused })} />
      {form.paused ? (
        <DateField label="Paused until" value={form.disabledUntil} onChange={(disabledUntil) => setForm({ ...form, disabledUntil })} clearable placeholder="Until I turn it back on" />
      ) : null}
    </FormSheet>
  );
}
