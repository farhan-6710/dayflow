import { useRouter } from "expo-router";
import { History, Pause, Pencil, Play, Trash2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import { DAYS, REMINDER_STATUS, describeDays, todayKey } from "@/features/reminders/reminderMeta";
import { ReminderFormSheet } from "@/features/reminders/ReminderFormSheet";
import { useReminderActions, useReminders } from "@/features/reminders/useReminders";
import { cn } from "@/lib/cn";
import { useRefresh } from "@/lib/query";
import { useTheme } from "@/theme/ThemeProvider";
import { EmptyState } from "@/ui/EmptyState";
import { Fab } from "@/ui/Fab";
import { IconButton } from "@/ui/IconButton";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { QueryState } from "@/ui/QueryState";
import { BackHeader, Screen } from "@/ui/Screen";
import { SegmentedTabs } from "@/ui/SegmentedTabs";
import { StatusPill } from "@/ui/StatusPill";
import { SwipeRow } from "@/ui/SwipeRow";
import { Text } from "@/ui/Text";
import type { Reminder } from "@types";

type ReminderTab = "today" | "all";

function sortByTime(reminders: Reminder[]) {
  return [...reminders].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
}

export default function RemindersScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const query = useReminders();
  const refresh = useRefresh(query);
  const { confirmDelete, setStatus } = useReminderActions();
  const [tab, setTab] = useState<ReminderTab>("today");
  const [form, setForm] = useState<{ open: boolean; reminder: Reminder | null }>({ open: false, reminder: null });

  const today = todayKey();
  const todays = useMemo(() => sortByTime((query.data ?? []).filter((reminder) => !reminder.repeatDays?.length || reminder.repeatDays.includes(today))), [query.data, today]);
  const everything = useMemo(() => sortByTime(query.data ?? []), [query.data]);

  function row(reminder: Reminder) {
    const status = REMINDER_STATUS[reminder.status];
    const paused = reminder.status === "paused";
    return (
      <View key={reminder.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <SwipeRow
          title={reminder.name}
          accessibilityLabel={`${reminder.name}, ${reminder.displayTime}, ${describeDays(reminder.repeatDays)}, ${status.label}`}
          onPress={() => router.push(`/reminder-details/${reminder.id}`)}
          actions={[
            { label: "Edit", icon: Pencil, onPress: () => setForm({ open: true, reminder }) },
            paused
              ? { label: "Resume", icon: Play, onPress: () => setStatus.mutate({ id: reminder.id, updates: { status: "upcoming", disabledUntil: null } }) }
              : { label: "Pause", icon: Pause, onPress: () => setStatus.mutate({ id: reminder.id, updates: { status: "paused" } }) },
            { label: "Delete", icon: Trash2, destructive: true, onPress: () => void confirmDelete(reminder) },
          ]}
        >
          <View className="gap-2 p-3.5">
            <View className="flex-row items-start gap-3">
              <View className="flex-1">
                <Text variant="subheading" numberOfLines={1}>
                  {reminder.name}
                </Text>
                <Text variant="label" tone="muted">
                  {`${reminder.displayTime} · ${describeDays(reminder.repeatDays)}`}
                </Text>
              </View>
              <StatusPill label={status.label} tone={status.tone} />
            </View>
            {tab === "all" ? (
              <View className="flex-row gap-1.5">
                {DAYS.map((day) => {
                  const on = !reminder.repeatDays?.length || reminder.repeatDays.includes(day.key);
                  return (
                    <View key={day.key} className={cn("size-7 items-center justify-center rounded-full", on ? "bg-primary" : "bg-muted", day.key === today && "border border-chart-1")}>
                      <Text variant="caption" tone={on ? "inverse" : "muted"}>
                        {day.letter}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        </SwipeRow>
      </View>
    );
  }

  return (
    <Screen>
      <BackHeader title="Daily reminders" right={<IconButton icon={History} label="Reminder history" onPress={() => router.push("/reminder-history")} />} />
      <View className="px-4 py-2">
        <SegmentedTabs
          tabs={[
            { value: "today", label: "Today", count: query.data ? todays.length : undefined },
            { value: "all", label: "All reminders", count: query.data ? everything.length : undefined },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>
      <ScrollView
        refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 10 }}
      >
        <QueryState query={query} skeleton={<ListSkeleton rows={5} />}>
          {(reminders) =>
            reminders.length === 0 ? (
              <EmptyState art="reminders" title="No reminders yet" description="Set repeating nudges by weekday and time." actionLabel="Add reminder" onAction={() => setForm({ open: true, reminder: null })} />
            ) : tab === "today" && todays.length === 0 ? (
              <EmptyState art="reminders" title="Nothing today" description="No reminders repeat on this day." />
            ) : (
              (tab === "today" ? todays : everything).map(row)
            )
          }
        </QueryState>
      </ScrollView>
      <Fab label="New reminder" onPress={() => setForm({ open: true, reminder: null })} />
      <ReminderFormSheet open={form.open} reminder={form.reminder} onClose={() => setForm((current) => ({ ...current, open: false }))} />
    </Screen>
  );
}
