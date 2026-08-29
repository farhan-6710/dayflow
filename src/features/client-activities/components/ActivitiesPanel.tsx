import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

import { ActivityCallDialog } from "@/features/client-activities/components/ActivityCallDialog";
import { ActivityColumns } from "@/features/client-activities/components/ActivityColumns";
import { ActivityMeetingDialog } from "@/features/client-activities/components/ActivityMeetingDialog";
import { ActivityTaskDialog } from "@/features/client-activities/components/ActivityTaskDialog";
import type { ClientActivitiesSectionProps } from "@/features/client-activities/types/components";
import type {
  ClientActivityCall,
  ClientActivityMeeting,
  ClientActivityTask,
} from "@/features/client-activities/types/types";
import {
  activityCallToFormValues,
  activityMeetingToFormValues,
  activityTaskToFormValues,
  emptyActivityCallForm,
  emptyActivityMeetingForm,
  emptyActivityTaskForm,
  type ClientActivityCallFormValues,
  type ClientActivityMeetingFormValues,
  type ClientActivityTaskFormValues,
} from "@/features/client-activities/utils/activityFormUtils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type DialogKind = "task" | "meeting" | "call" | null;

type ActivitiesPanelProps = ClientActivitiesSectionProps & {
  title: string;
  description: string;
};

export function ActivitiesPanel({
  title,
  description,
  tasks,
  meetings,
  calls,
  canEdit,
  isSaving = false,
  showProjectName = false,
  showAddNew = false,
  fixedProjectId,
  projectOptions = [],
  requireProjectSelection = false,
  onSaveTask,
  onDeleteTask,
  onSaveMeeting,
  onDeleteMeeting,
  onSaveCall,
  onDeleteCall,
}: ActivitiesPanelProps) {
  const [dialogKind, setDialogKind] = useState<DialogKind>(null);
  const [editingTask, setEditingTask] = useState<ClientActivityTask | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<ClientActivityMeeting | null>(
    null,
  );
  const [editingCall, setEditingCall] = useState<ClientActivityCall | null>(null);
  const defaultProjectId = fixedProjectId ?? projectOptions[0]?.id ?? "";

  const resolveProjectId = (formProjectId: string) =>
    fixedProjectId ?? formProjectId;
  const [taskValues, setTaskValues] = useState<ClientActivityTaskFormValues>(
    emptyActivityTaskForm(defaultProjectId),
  );
  const [meetingValues, setMeetingValues] = useState<ClientActivityMeetingFormValues>(
    emptyActivityMeetingForm(defaultProjectId),
  );
  const [callValues, setCallValues] = useState<ClientActivityCallFormValues>(
    emptyActivityCallForm(defaultProjectId),
  );

  const openAdd = (kind: Exclude<DialogKind, null>) => {
    setEditingTask(null);
    setEditingMeeting(null);
    setEditingCall(null);
    setTaskValues(emptyActivityTaskForm(defaultProjectId));
    setMeetingValues(emptyActivityMeetingForm(defaultProjectId));
    setCallValues(emptyActivityCallForm(defaultProjectId));
    setDialogKind(kind);
  };

  const closeDialog = () => setDialogKind(null);

  const canAddNew =
    canEdit &&
    showAddNew &&
    (!requireProjectSelection || projectOptions.length > 0);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-5">
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        {canAddNew ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={isSaving}
              >
                <Plus className="mr-1.5 size-3.5" />
                Add New
                <ChevronDown className="ml-1.5 size-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => openAdd("task")}>
                Task
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openAdd("meeting")}>
                Meeting
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openAdd("call")}>
                Call
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <div className="px-6 py-5">
        <ActivityColumns
          tasks={tasks}
          meetings={meetings}
          calls={calls}
          canEdit={canEdit}
          showProjectName={showProjectName}
          onEditTask={(task) => {
            setEditingTask(task);
            setTaskValues(activityTaskToFormValues(task));
            setDialogKind("task");
          }}
          onEditMeeting={(meeting) => {
            setEditingMeeting(meeting);
            setMeetingValues(activityMeetingToFormValues(meeting));
            setDialogKind("meeting");
          }}
          onEditCall={(call) => {
            setEditingCall(call);
            setCallValues(activityCallToFormValues(call));
            setDialogKind("call");
          }}
        />
      </div>

      <ActivityTaskDialog
        open={dialogKind === "task"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        isEditing={Boolean(editingTask)}
        isSaving={isSaving}
        values={taskValues}
        showProjectSelect={requireProjectSelection}
        projectOptions={projectOptions}
        onFieldChange={(field, value) =>
          setTaskValues((current) => ({ ...current, [field]: value }))
        }
        onSave={() => {
          void (async () => {
            try {
              await onSaveTask(
                editingTask?.id ?? null,
                resolveProjectId(taskValues.projectId),
                {
                  title: taskValues.title,
                  description: taskValues.description || null,
                  priority: taskValues.priority,
                  status: taskValues.status,
                  etaDate: taskValues.etaDate,
                  etaTime: taskValues.etaTime,
                },
              );
              closeDialog();
            } catch {
              // Caller toasts.
            }
          })();
        }}
        onDelete={
          editingTask
            ? async () => {
                await onDeleteTask(editingTask.id);
                closeDialog();
              }
            : undefined
        }
      />

      <ActivityMeetingDialog
        open={dialogKind === "meeting"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        isEditing={Boolean(editingMeeting)}
        isSaving={isSaving}
        values={meetingValues}
        showProjectSelect={requireProjectSelection}
        projectOptions={projectOptions}
        onFieldChange={(field, value) =>
          setMeetingValues((current) => ({ ...current, [field]: value }))
        }
        onSave={() => {
          void (async () => {
            try {
              await onSaveMeeting(
                editingMeeting?.id ?? null,
                resolveProjectId(meetingValues.projectId),
                {
                  title: meetingValues.title,
                  description: meetingValues.description || null,
                  status: meetingValues.status,
                  fromDate: meetingValues.fromDate,
                  fromTime: meetingValues.fromTime,
                  toDate: meetingValues.toDate,
                  toTime: meetingValues.toTime,
                  venue: meetingValues.venue,
                },
              );
              closeDialog();
            } catch {
              // Caller toasts.
            }
          })();
        }}
        onDelete={
          editingMeeting
            ? async () => {
                await onDeleteMeeting(editingMeeting.id);
                closeDialog();
              }
            : undefined
        }
      />

      <ActivityCallDialog
        open={dialogKind === "call"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        isEditing={Boolean(editingCall)}
        isSaving={isSaving}
        values={callValues}
        showProjectSelect={requireProjectSelection}
        projectOptions={projectOptions}
        onFieldChange={(field, value) =>
          setCallValues((current) => ({ ...current, [field]: value }))
        }
        onSave={() => {
          void (async () => {
            const durationMinutes = Number(callValues.durationMinutes);
            try {
              await onSaveCall(editingCall?.id ?? null, resolveProjectId(callValues.projectId), {
                title: callValues.title,
                description: callValues.description || null,
                status: callValues.status,
                startDate: callValues.startDate,
                startTime: callValues.startTime,
                durationMinutes,
              });
              closeDialog();
            } catch {
              // Caller toasts.
            }
          })();
        }}
        onDelete={
          editingCall
            ? async () => {
                await onDeleteCall(editingCall.id);
                closeDialog();
              }
            : undefined
        }
      />
    </div>
  );
}
