import { formatDistanceToNow } from "date-fns";
import { Bell, Check, ListChecks } from "lucide-react-native";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import { useNotifications } from "@/features/notifications/useNotifications";
import { useRefresh } from "@/lib/query";
import type { AppNotification, NotificationType } from "@/shared/types/types";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { EmptyState } from "@/ui/EmptyState";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { QueryState } from "@/ui/QueryState";
import { SegmentedTabs } from "@/ui/SegmentedTabs";
import { SwipeRow } from "@/ui/SwipeRow";
import { Text } from "@/ui/Text";

type InboxListProps = {
  /** Where tapping a notification goes, if anywhere. */
  onOpen?: (notification: AppNotification) => void;
};

export function InboxList({ onOpen }: InboxListProps) {
  const { colors } = useTheme();
  const { list, markRead, markAllRead } = useNotifications();
  const refresh = useRefresh(list);
  const [type, setType] = useState<NotificationType>("reminder");
  const all = list.data ?? [];
  const reminders = all.filter((item) => item.notification_type === "reminder");
  const tasks = all.filter((item) => item.notification_type === "task");
  const visible = type === "reminder" ? reminders : tasks;

  return (
    <ScrollView refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
      <SegmentedTabs
        tabs={[
          { value: "reminder" as const, label: "Reminders", count: list.data ? reminders.length : undefined },
          { value: "task" as const, label: "Tasks", count: list.data ? tasks.length : undefined },
        ]}
        value={type}
        onChange={setType}
      />
      <QueryState query={list} skeleton={<ListSkeleton rows={4} />}>
        {() =>
          visible.length === 0 ? (
            <EmptyState art="notifications" title="You're all caught up" description={type === "reminder" ? "Reminder alerts will appear here." : "Task alerts will appear here."} />
          ) : (
            <>
              <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                {visible.map((item, index) => {
                  const Icon = item.notification_type === "reminder" ? Bell : ListChecks;
                  return (
                    <View key={item.id} className={index > 0 ? "border-t border-border" : undefined}>
                      <SwipeRow
                        title={item.title}
                        accessibilityLabel={`${item.title}. ${item.message}`}
                        onPress={() => {
                          markRead.mutate(item.id);
                          onOpen?.(item);
                        }}
                        actions={[{ label: "Read", icon: Check, onPress: () => markRead.mutate(item.id) }]}
                      >
                        <View className="flex-row items-start gap-3 px-3.5 py-3">
                          <View className="mt-0.5 size-8 items-center justify-center rounded-lg bg-muted">
                            <Icon size={16} color={colors.foreground} />
                          </View>
                          <View className="flex-1 gap-0.5">
                            <Text numberOfLines={1}>{item.title}</Text>
                            <Text variant="label" tone="muted" numberOfLines={2}>
                              {item.message}
                            </Text>
                            <Text variant="caption" tone="muted">
                              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </Text>
                          </View>
                        </View>
                      </SwipeRow>
                    </View>
                  );
                })}
              </View>
              <Button label="Mark all as read" variant="outline" size="sm" icon={Check} loading={markAllRead.isPending} onPress={() => markAllRead.mutate(visible.map((item) => item.id))} />
            </>
          )
        }
      </QueryState>
    </ScrollView>
  );
}
