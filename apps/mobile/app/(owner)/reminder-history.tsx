import { useQuery } from "@tanstack/react-query";
import { RefreshControl, ScrollView, View } from "react-native";

import { useRefresh } from "@/lib/query";
import { fetchReminderOccurrences, groupOccurrencesByDate } from "@/services/reminderOccurrencesService";
import { useTheme } from "@/theme/ThemeProvider";
import { Card } from "@/ui/Card";
import { EmptyState } from "@/ui/EmptyState";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { QueryState } from "@/ui/QueryState";
import { BackHeader, Screen } from "@/ui/Screen";
import { Text } from "@/ui/Text";

export default function ReminderHistoryScreen() {
  const { colors } = useTheme();
  const query = useQuery({ queryKey: ["reminder-history"], queryFn: async () => groupOccurrencesByDate(await fetchReminderOccurrences()) });
  const refresh = useRefresh(query);

  return (
    <Screen>
      <BackHeader title="Reminder history" />
      <ScrollView refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />} contentContainerStyle={{ padding: 16, gap: 10 }}>
        <QueryState query={query} skeleton={<ListSkeleton rows={6} />}>
          {(days) =>
            days.length === 0 ? (
              <EmptyState art="reminders" title="No history yet" description="Each day's done and missed reminders appear here." />
            ) : (
              days.map((day) => {
                const percent = day.totalReminders > 0 ? (day.remindersChecked / day.totalReminders) * 100 : 0;
                return (
                  <Card key={day.id} className="gap-2 py-3" accessible accessibilityLabel={`${day.date}: ${day.remindersChecked} of ${day.totalReminders} done`}>
                    <View className="flex-row items-center justify-between gap-3">
                      <Text variant="subheading">{day.date}</Text>
                      <Text variant="label" tone="muted">{`${day.remindersChecked} of ${day.totalReminders} done`}</Text>
                    </View>
                    <View className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <View style={{ width: `${percent}%` }} className="h-full rounded-full bg-success" />
                    </View>
                  </Card>
                );
              })
            )
          }
        </QueryState>
      </ScrollView>
    </Screen>
  );
}
