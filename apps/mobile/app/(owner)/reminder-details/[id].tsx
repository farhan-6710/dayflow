import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, Pause, Pencil, Play, Trash2, X } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import { REMINDER_STATUS, describeDays } from "@/features/reminders/reminderMeta";
import { ReminderFormSheet } from "@/features/reminders/ReminderFormSheet";
import { useReminderActions, useReminders } from "@/features/reminders/useReminders";
import { parseDateValue } from "@/shared/utils/dateValue";
import { hasReminderTimePassed, repeatsOn } from "@/shared/utils/reminderDay";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { EmptyState } from "@/ui/EmptyState";
import { IconButton } from "@/ui/IconButton";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { QueryState } from "@/ui/QueryState";
import { BackHeader, Screen } from "@/ui/Screen";
import { StatusPill } from "@/ui/StatusPill";
import { Text } from "@/ui/Text";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-4 border-b border-border py-2.5">
      <Text tone="muted">{label}</Text>
      <Text className="shrink text-right capitalize">{value}</Text>
    </View>
  );
}

/** Notification taps land here, so this route stays at /reminder-details/:id. */
export default function ReminderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const query = useReminders();
  const { setStatus, confirmDelete } = useReminderActions();
  const [editing, setEditing] = useState(false);
  const reminder = query.data?.find((item) => item.id === id);

  return (
    <Screen>
      <BackHeader title="Reminder" right={reminder ? <IconButton icon={Pencil} label="Edit reminder" onPress={() => setEditing(true)} /> : null} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <QueryState query={query} skeleton={<ListSkeleton rows={2} />}>
          {() =>
            !reminder ? (
              <EmptyState art="reminders" title="Reminder not found" description="It may have been deleted." actionLabel="Back" onAction={() => router.back()} />
            ) : (
              <>
                <View className="gap-2">
                  <StatusPill label={REMINDER_STATUS[reminder.status].label} tone={REMINDER_STATUS[reminder.status].tone} />
                  <Text variant="display">{reminder.name}</Text>
                  {reminder.description ? <Text variant="prose" tone="muted">{reminder.description}</Text> : null}
                </View>
                <Card className="py-1">
                  <Row label="Time" value={reminder.displayTime} />
                  <Row label="Repeats" value={describeDays(reminder.repeatDays)} />
                  <Row label="Category" value={reminder.category ?? "None"} />
                  {reminder.status === "paused" ? (
                    <Row
                      label="Paused until"
                      value={(() => {
                        const until = parseDateValue(reminder.disabledUntil);
                        return until ? format(until, "MMM d, yyyy") : "Turned back on";
                      })()}
                    />
                  ) : null}
                </Card>
                {reminder.status !== "paused" && repeatsOn(reminder, new Date()) && hasReminderTimePassed(reminder) ? (
                  <View className="flex-row gap-3">
                    <Button label="Done" variant="success" icon={Check} className="flex-1" loading={setStatus.isPending} disabled={reminder.status === "done"} onPress={() => setStatus.mutate({ id: reminder.id, updates: { status: "done" } })} />
                    <Button label="Missed" variant="outline" icon={X} className="flex-1" disabled={setStatus.isPending || reminder.status === "missed"} onPress={() => setStatus.mutate({ id: reminder.id, updates: { status: "missed" } })} />
                  </View>
                ) : null}
                {reminder.status === "paused" ? (
                  <Button label="Resume reminder" icon={Play} loading={setStatus.isPending} onPress={() => setStatus.mutate({ id: reminder.id, updates: { status: "upcoming", disabledUntil: null } })} />
                ) : (
                  <Button label="Pause reminder" variant="outline" icon={Pause} loading={setStatus.isPending} onPress={() => setStatus.mutate({ id: reminder.id, updates: { status: "paused" } })} />
                )}
                <Button
                  label="Delete reminder"
                  variant="outline"
                  icon={Trash2}
                  onPress={() => {
                    void confirmDelete(reminder).then((deleted) => {
                      if (deleted) router.back();
                    });
                  }}
                />
              </>
            )
          }
        </QueryState>
      </ScrollView>
      <ReminderFormSheet open={editing} reminder={reminder} onClose={() => setEditing(false)} />
    </Screen>
  );
}
