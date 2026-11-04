import { CircleCheck, CirclePlay, Pencil, Plus, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { ACTIVITY_KINDS, ACTIVITY_STATUS_TONE, statusLabel, type ActivityItem, type ActivityKind } from "@/features/activities/activityModel";
import { ActivityFormSheet } from "@/features/activities/ActivityFormSheet";
import { useActivities, type ActivityScope } from "@/features/activities/useActivities";
import { useActivityActions } from "@/features/activities/useActivityActions";
import type { ClientActivityRaisedBy } from "@/shared/types/activities";
import { Button } from "@/ui/Button";
import { EmptyState } from "@/ui/EmptyState";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { QueryState } from "@/ui/QueryState";
import { SegmentedTabs } from "@/ui/SegmentedTabs";
import { StatusPill } from "@/ui/StatusPill";
import type { SheetAction } from "@/ui/ActionSheet";
import { SwipeRow } from "@/ui/SwipeRow";
import { Text } from "@/ui/Text";

type ActivitiesPanelProps = {
  scope: ActivityScope;
  /** Who is using this: decides what new items are saved as, and what can be edited. */
  raisedBy: ClientActivityRaisedBy;
  projects: { id: string; name: string }[];
  /** How to name the client on items they raised. */
  clientLabel?: string;
};

/** The shared activities block for both the workspace and the client. */
export function ActivitiesPanel({ scope, raisedBy, projects, clientLabel = "client" }: ActivitiesPanelProps) {
  const query = useActivities(scope);
  const { setStatus, confirmDelete } = useActivityActions();
  const [kind, setKind] = useState<ActivityKind>("task");
  const [form, setForm] = useState<{ open: boolean; item: ActivityItem | null }>({ open: false, item: null });

  const canEdit = (item: ActivityItem) => raisedBy === "workspace" || item.raisedBy === "client";
  const groups = { task: query.data?.tasks ?? [], meeting: query.data?.meetings ?? [], call: query.data?.calls ?? [] };
  const items = groups[kind];
  const open = items.filter((item) => item.status !== "completed");
  const closed = items.filter((item) => item.status === "completed");
  const current = ACTIVITY_KINDS.find((entry) => entry.value === kind) ?? { value: kind, label: "Activity", plural: "Activities" };
  const canAdd = projects.length > 0;

  function actionsFor(item: ActivityItem): SheetAction[] {
    if (!canEdit(item)) return [];
    const next: SheetAction[] = [];
    if (item.status === "pending") next.push({ label: "Start", icon: CirclePlay, onPress: () => setStatus.mutate({ item, status: "in_progress" }) });
    if (item.status !== "completed") next.push({ label: "Complete", icon: CircleCheck, onPress: () => setStatus.mutate({ item, status: "completed" }) });
    next.push({ label: "Edit", icon: Pencil, onPress: () => setForm({ open: true, item }) });
    next.push({ label: "Delete", icon: Trash2, destructive: true, onPress: () => void confirmDelete(item) });
    return next;
  }

  function section(title: string, rows: ActivityItem[]) {
    if (rows.length === 0) return null;
    return (
      <View className="gap-1.5">
        <Text variant="label" tone="muted">{`${title} · ${rows.length}`}</Text>
        <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {rows.map((item, index) => {
            const actions = actionsFor(item);
            const raised = item.raisedBy === "client" ? (raisedBy === "client" ? "Raised by you" : `Raised by ${clientLabel}`) : raisedBy === "client" ? "From your freelancer" : null;
            const content = (
              <View className="gap-1 px-3.5 py-3">
                <View className="flex-row items-start gap-3">
                  <Text numberOfLines={2} className="flex-1">
                    {item.title}
                  </Text>
                  <StatusPill label={statusLabel(item.status)} tone={ACTIVITY_STATUS_TONE[item.status]} />
                </View>
                <Text variant="caption" tone="muted">
                  {[item.projectName, item.meta, raised].filter(Boolean).join(" · ")}
                </Text>
              </View>
            );
            return (
              <View key={item.id} className={index > 0 ? "border-t border-border" : undefined}>
                {actions.length > 0 ? (
                  <SwipeRow title={item.title} accessibilityLabel={`${item.title}, ${statusLabel(item.status)}`} onPress={() => setForm({ open: true, item })} actions={actions}>
                    {content}
                  </SwipeRow>
                ) : (
                  content
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <SegmentedTabs
        tabs={ACTIVITY_KINDS.map((entry) => ({ value: entry.value, label: entry.plural, count: query.data ? groups[entry.value].filter((item) => item.status !== "completed").length : undefined }))}
        value={kind}
        onChange={setKind}
      />
      <QueryState query={query} skeleton={<ListSkeleton rows={3} />}>
        {() =>
          items.length === 0 ? (
            <EmptyState
              art="activities"
              title={`No ${current.plural.toLowerCase()} yet`}
              description={canAdd ? `Add one to keep ${current.plural.toLowerCase()} in view for both of you.` : "Activities need a project first."}
              actionLabel={canAdd ? (raisedBy === "client" ? `Raise ${current.label.toLowerCase()}` : `Add ${current.label.toLowerCase()}`) : undefined}
              onAction={() => setForm({ open: true, item: null })}
            />
          ) : (
            <>
              {section("Open", open)}
              {section("Closed", closed)}
              {canAdd ? <Button label={raisedBy === "client" ? `Raise ${current.label.toLowerCase()}` : `Add ${current.label.toLowerCase()}`} variant="outline" size="sm" icon={Plus} onPress={() => setForm({ open: true, item: null })} /> : null}
            </>
          )
        }
      </QueryState>
      <ActivityFormSheet
        open={form.open}
        onClose={() => setForm((value) => ({ ...value, open: false }))}
        kind={form.item?.kind ?? kind}
        item={form.item}
        raisedBy={raisedBy}
        projects={projects}
        defaultProjectId={scope.kind === "project" ? scope.id : undefined}
      />
    </View>
  );
}
