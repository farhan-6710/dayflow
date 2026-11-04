import { useState } from "react";
import { Plus } from "lucide-react";

import { ActivityCallDialog } from "@/features/workspace/client-activities/components/ActivityCallDialog";
import { ActivityList } from "@/features/workspace/client-activities/components/ActivityList";
import { ActivityMeetingDialog } from "@/features/workspace/client-activities/components/ActivityMeetingDialog";
import { ActivityTaskDialog } from "@/features/workspace/client-activities/components/ActivityTaskDialog";
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
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

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

  return (
    <Reveal as="section" className={cn(panelClassName, "@container min-w-0 p-4 sm:p-5")}>
      <Tabs value={activeKind} onValueChange={(kind) => setActiveKind(kind as ActivityKind)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl">{isPortal ? "Activities" : "Client activities"}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <TabsList className="h-10 p-1">
              {TABS.map((tab) => (
                <TabsTrigger key={tab.kind} value={tab.kind} className="h-8 min-h-8 px-3 text-foreground dark:text-foreground">
                  {tab.label}
                  {activities.loading ? null : (
                    <span className="tabular-nums">{activities.rows[tab.kind].length}</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            {canEdit ? (
              <Button className="h-10" onClick={() => setDialog({ kind: activeKind, source: null })}>
                <Plus aria-hidden="true" />
                New {activeLabel.toLowerCase()}
              </Button>
            ) : null}
          </div>
        </div>

        {activities.error ? (
          <div className="mt-4">
            <ErrorBanner message={activities.error} onRetry={activities.reload} />
          </div>
        ) : null}

        {activities.loading ? (
          <div className="mt-3">
            <TableSkeleton rows={3} />
          </div>
        ) : (
          TABS.map((tab) => {
            const rows = activities.rows[tab.kind];
            const open = rows.filter((row) => isClientActivityOpen(row.status));
            const closed = rows.filter((row) => !isClientActivityOpen(row.status));
            return (
              <TabsContent key={tab.kind} value={tab.kind} className="mt-3">
                {rows.length === 0 && !activities.error ? (
                  <EmptyState
                    bare
                    className="py-6"
                    image="icon-empty-activities"
                    title={`No ${tab.plural} yet`}
                    description={canEdit ? `Add one to keep ${tab.plural} in view for both of you.` : `${tab.label} will show up here.`}
                  />
                ) : (
                  <div className="grid gap-4 @3xl:grid-cols-2 @3xl:gap-8">
                    {[
                      { title: "Open", list: open, empty: `Nothing open.` },
                      { title: "Closed", list: closed, empty: `Nothing closed yet.` },
                    ].map((group) => (
                      <div key={group.title} className="min-w-0">
                        <h3 className="text-sm text-muted-foreground">
                          {group.title} <span className="tabular-nums">({group.list.length})</span>
                        </h3>
                        <ActivityList
                          clientLabel={isPortal ? "you" : "client"}
                          rows={group.list}
                          emptyLabel={group.empty}
                          canEditRow={canEditRow}
                          onEdit={(row) => setDialog({ kind: row.source.kind, source: row.source })}
                          onDelete={activities.setRowToDelete}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })
        )}
      </Tabs>

      <ActivityTaskDialog
        {...dialogProps}
        open={dialog?.kind === "task"}
        item={dialogSource?.kind === "task" ? dialogSource.item : null}
        onSave={activities.saveTask}
      />
      <ActivityMeetingDialog
        {...dialogProps}
        open={dialog?.kind === "meeting"}
        item={dialogSource?.kind === "meeting" ? dialogSource.item : null}
        onSave={activities.saveMeeting}
      />
      <ActivityCallDialog
        {...dialogProps}
        open={dialog?.kind === "call"}
        item={dialogSource?.kind === "call" ? dialogSource.item : null}
        onSave={activities.saveCall}
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
}
