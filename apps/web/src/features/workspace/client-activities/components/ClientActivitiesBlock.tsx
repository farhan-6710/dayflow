import { useEffect, useState } from "react";
import { Activity, Plus } from "lucide-react";

import { ActivityCallDialog } from "@/features/workspace/client-activities/components/ActivityCallDialog";
import { ActivityList } from "@/features/workspace/client-activities/components/ActivityList";
import { ActivityMeetingDialog } from "@/features/workspace/client-activities/components/ActivityMeetingDialog";
import { ActivityTaskDialog } from "@/features/workspace/client-activities/components/ActivityTaskDialog";
import { ACTIVITY_SKELETON_CELLS } from "@/features/workspace/client-activities/constants/skeleton";
import { useClientActivities } from "@/features/workspace/client-activities/hooks/useClientActivities";
import type {
  ActivityItem,
  ActivityKind,
  ActivityListRow,
  ClientActivitiesBlockProps,
} from "@/features/workspace/client-activities/types/components";
import { isClientActivityOpen } from "@/features/workspace/client-activities/utils/activityFormUtils";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { PanelHeading } from "@/shared/components/PanelHeading";
import { Phantom } from "@/shared/components/Phantom";
import { PillTabs } from "@/shared/components/PillTabs";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

const TABS: { kind: ActivityKind; label: string; plural: string }[] = [
  { kind: "task", label: "Tasks", plural: "tasks" },
  { kind: "meeting", label: "Meetings", plural: "meetings" },
  { kind: "call", label: "Calls", plural: "calls" },
];

type DialogState = { kind: ActivityKind; source: ActivityItem | null } | null;

export function ClientActivitiesBlock(props: ClientActivitiesBlockProps) {
  const { canEdit = true, activityRaisedBy = "workspace" } = props;
  const activities = useClientActivities(props);
  const [activeKind, setActiveKind] = useState<ActivityKind>("task");
  const [dialog, setDialog] = useState<DialogState>(null);

  const { loading, rows } = activities;
  const { onRowsChange } = props;
  useEffect(() => {
    if (!loading) {
      onRowsChange?.(rows);
    }
  }, [loading, rows, onRowsChange]);

  const isPortal = activityRaisedBy === "client";
  const fixedProjectId = props.scope === "project" ? props.projectId : undefined;
  const projectOptions = props.scope === "client" ? props.projects : undefined;

  function canEditRow(row: ActivityListRow) {
    return canEdit && (activityRaisedBy !== "client" || row.raisedBy === "client");
  }

  const dialogSource = dialog?.source;
  const dialogProps = {
    onOpenChange: (open: boolean) => !open && setDialog(null),
    fixedProjectId,
    projectOptions,
  };
  const activeLabel = TABS.find((tab) => tab.kind === activeKind)?.label.slice(0, -1) ?? "";

  const activeTab = TABS.find((tab) => tab.kind === activeKind) ?? TABS[0];
  const activeRows = activities.rows[activeKind];
  const openRows = activeRows.filter((row) => isClientActivityOpen(row.status));
  const closedRows = activeRows.filter((row) => !isClientActivityOpen(row.status));

  const panel = (
    <Reveal as="section" className={cn(panelClassName, "@container min-w-0 p-4 sm:p-5")}>
      <PanelHeading
        icon={Activity}
        title={isPortal ? "Activities" : "Client Activities"}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <PillTabs
              label="Activity type"
              value={activeKind}
              onChange={(kind) => setActiveKind(kind as ActivityKind)}
              options={TABS.map((tab) => ({
                value: tab.kind,
                label: tab.label,
                count: activities.loading ? undefined : activities.rows[tab.kind].length,
              }))}
            />
            {canEdit ? (
              <Button className="h-10" onClick={() => setDialog({ kind: activeKind, source: null })}>
                <Plus aria-hidden="true" />
                New {activeLabel}
              </Button>
            ) : null}
          </div>
        }
      />

      {activities.error ? (
        <div className="mt-4">
          <ErrorBanner message={activities.error} onRetry={activities.reload} />
        </div>
      ) : null}

      {activities.loading ? (
        <div className="mt-3">
          <TableSkeleton rows={3} flush cells={ACTIVITY_SKELETON_CELLS} />
        </div>
      ) : activeRows.length === 0 && !activities.error ? (
        <EmptyState
          bare
          className="mt-3 py-6"
          image="icon-empty-activities"
          title={`No ${activeTab.plural} yet`}
          description={canEdit ? `Add one to keep ${activeTab.plural} in view for both of you.` : `${activeTab.label} will show up here.`}
        />
      ) : (
        <div className="mt-3 grid gap-4 @3xl:grid-cols-2 @3xl:gap-6 @3xl:[&>*+*]:border-l @3xl:[&>*+*]:border-border @3xl:[&>*+*]:pl-6">
          {[
            { title: "Open", list: openRows, empty: "Nothing open." },
            { title: "Closed", list: closedRows, empty: "Nothing closed yet." },
          ].map((group) => (
            <div key={group.title} className="min-w-0">
              <h3 className="mb-1 text-sm">
                {group.title} <span className="text-muted-foreground tabular-nums">({group.list.length})</span>
              </h3>
              <ActivityList
                clientLabel={isPortal ? "you" : "client"}
                rows={group.list}
                emptyLabel={group.empty}
                canEditRow={canEditRow}
                togglingId={activities.togglingId}
                onToggleStatus={activities.toggleStatus}
                onEdit={(row) => setDialog({ kind: row.source.kind, source: row.source })}
                onDelete={activities.setRowToDelete}
              />
            </div>
          ))}
        </div>
      )}

      <ActivityTaskDialog
        {...dialogProps}
        open={dialog?.kind === "task"}
        item={dialogSource?.kind === "task" ? dialogSource.item : null}
        onSave={activities.saveTask}
        onDelete={
          dialogSource?.kind === "task"
            ? () => {
                const row = activities.rows.task.find((entry) => entry.id === dialogSource.item.id);
                setDialog(null);
                if (row) activities.setRowToDelete(row);
              }
            : undefined
        }
      />
      <ActivityMeetingDialog
        {...dialogProps}
        open={dialog?.kind === "meeting"}
        item={dialogSource?.kind === "meeting" ? dialogSource.item : null}
        onSave={activities.saveMeeting}
        onDelete={
          dialogSource?.kind === "meeting"
            ? () => {
                const row = activities.rows.meeting.find((entry) => entry.id === dialogSource.item.id);
                setDialog(null);
                if (row) activities.setRowToDelete(row);
              }
            : undefined
        }
      />
      <ActivityCallDialog
        {...dialogProps}
        open={dialog?.kind === "call"}
        item={dialogSource?.kind === "call" ? dialogSource.item : null}
        onSave={activities.saveCall}
        onDelete={
          dialogSource?.kind === "call"
            ? () => {
                const row = activities.rows.call.find((entry) => entry.id === dialogSource.item.id);
                setDialog(null);
                if (row) activities.setRowToDelete(row);
              }
            : undefined
        }
      />
      <ConfirmationModal
        open={activities.rowToDelete !== null}
        onOpenChange={(open) => !open && activities.setRowToDelete(null)}
        title={`Delete "${activities.rowToDelete?.title ?? ""}"?`}
        description={`This removes it for you and your ${isPortal ? "provider" : "client"}, and can't be undone.`}
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={activities.deleting}
        onConfirm={activities.confirmDelete}
      />
    </Reveal>
  );

  return activities.loading ? <Phantom>{panel}</Phantom> : panel;
}
