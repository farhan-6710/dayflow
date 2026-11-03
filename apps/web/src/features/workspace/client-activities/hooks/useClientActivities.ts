import { useCallback, useMemo, useState } from "react";

import type {
  ActivityKind,
  ActivityListRow,
  ClientActivitiesBlockProps,
} from "@/features/workspace/client-activities/types/components";
import {
  PRIORITY_LABELS,
  VENUE_LABELS,
} from "@/features/workspace/client-activities/constants/activityOptions";
import type {
  CreateClientActivityCallInput,
  CreateClientActivityMeetingInput,
  CreateClientActivityTaskInput,
} from "@/features/workspace/client-activities/types/types";
import { formatActivityDateTime } from "@/features/workspace/client-activities/utils/activityDisplay";
import {
  createClientActivityCall,
  createClientActivityMeeting,
  createClientActivityTask,
  deleteClientActivityCall,
  deleteClientActivityMeeting,
  deleteClientActivityTask,
  fetchClientActivityCallsByClientId,
  fetchClientActivityCallsByProjectId,
  fetchClientActivityMeetingsByClientId,
  fetchClientActivityMeetingsByProjectId,
  fetchClientActivityTasksByClientId,
  fetchClientActivityTasksByProjectId,
  updateClientActivityCall,
  updateClientActivityMeeting,
  updateClientActivityTask,
} from "@/services/clientActivitiesService";
import { useLoadData } from "@/shared/hooks/useLoadData";
import { showToast } from "@/shared/utils/showToast";

const KIND_LABELS: Record<ActivityKind, string> = { task: "Task", meeting: "Meeting", call: "Call" };

export function useClientActivities(props: ClientActivitiesBlockProps) {
  const { activityRaisedBy = "workspace", onChange } = props;
  const projectId = props.scope === "project" ? props.projectId : undefined;
  const clientId = props.scope === "client" ? props.clientId : undefined;
  const [deleting, setDeleting] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ActivityListRow | null>(null);

  const loader = useCallback(async () => {
    const [tasks, meetings, calls] = projectId
      ? await Promise.all([
          fetchClientActivityTasksByProjectId(projectId),
          fetchClientActivityMeetingsByProjectId(projectId),
          fetchClientActivityCallsByProjectId(projectId),
        ])
      : await Promise.all([
          fetchClientActivityTasksByClientId(clientId ?? ""),
          fetchClientActivityMeetingsByClientId(clientId ?? ""),
          fetchClientActivityCallsByClientId(clientId ?? ""),
        ]);
    return { tasks, meetings, calls };
  }, [projectId, clientId]);
  const { data, loading, error, reload } = useLoadData(loader, "Couldn't load client activities.");

  const showProject = props.scope === "client";

  const rows = useMemo(() => {
    const withProject = (name: string | undefined, meta: string[]) => (showProject && name ? [name, ...meta] : meta);
    return {
      task: (data?.tasks ?? []).map((item): ActivityListRow => ({
        id: item.id,
        title: item.title,
        status: item.status,
        raisedBy: item.raised_by,
        meta: withProject(item.project_name, [
          formatActivityDateTime(item.eta_date, item.eta_time),
          `${PRIORITY_LABELS[item.priority]} priority`,
        ]),
        source: { kind: "task", item },
      })),
      meeting: (data?.meetings ?? []).map((item): ActivityListRow => ({
        id: item.id,
        title: item.title,
        status: item.status,
        raisedBy: item.raised_by,
        meta: withProject(item.project_name, [
          formatActivityDateTime(item.from_date, item.from_time),
          VENUE_LABELS[item.venue],
        ]),
        source: { kind: "meeting", item },
      })),
      call: (data?.calls ?? []).map((item): ActivityListRow => ({
        id: item.id,
        title: item.title,
        status: item.status,
        raisedBy: item.raised_by,
        meta: withProject(item.project_name, [
          formatActivityDateTime(item.start_date, item.start_time),
          `${item.duration_minutes} min`,
        ]),
        source: { kind: "call", item },
      })),
    };
  }, [data, showProject]);

  /** Shows the outcome, refreshes, and rethrows so the dialog stays open on failure. */
  async function runSave(kind: ActivityKind, isUpdate: boolean, action: () => Promise<unknown>) {
    try {
      await action();
      showToast("success", `${KIND_LABELS[kind]} ${isUpdate ? "updated" : "created"}.`);
      reload();
      onChange?.();
    } catch (saveError) {
      console.error(`Failed to save ${kind}:`, saveError);
      showToast("error", saveError instanceof Error ? saveError.message : `Couldn't save the ${kind}.`);
      throw saveError;
    }
  }

  function saveTask(id: string | null, project: string, input: CreateClientActivityTaskInput) {
    return runSave("task", Boolean(id), () =>
      id ? updateClientActivityTask(id, input) : createClientActivityTask(project, { ...input, raisedBy: activityRaisedBy }),
    );
  }

  function saveMeeting(id: string | null, project: string, input: CreateClientActivityMeetingInput) {
    return runSave("meeting", Boolean(id), () =>
      id
        ? updateClientActivityMeeting(id, input)
        : createClientActivityMeeting(project, { ...input, raisedBy: activityRaisedBy }),
    );
  }

  function saveCall(id: string | null, project: string, input: CreateClientActivityCallInput) {
    return runSave("call", Boolean(id), () =>
      id ? updateClientActivityCall(id, input) : createClientActivityCall(project, { ...input, raisedBy: activityRaisedBy }),
    );
  }

  async function confirmDelete() {
    if (!rowToDelete) {
      return;
    }
    const { kind } = rowToDelete.source;
    const remove = {
      task: deleteClientActivityTask,
      meeting: deleteClientActivityMeeting,
      call: deleteClientActivityCall,
    }[kind];
    setDeleting(true);
    try {
      await remove(rowToDelete.id);
      setRowToDelete(null);
      showToast("success", `${KIND_LABELS[kind]} deleted.`);
      reload();
      onChange?.();
    } catch (deleteError) {
      console.error(`Failed to delete ${kind}:`, deleteError);
      showToast("error", `Couldn't delete the ${kind}. Please try again.`);
    } finally {
      setDeleting(false);
    }
  }

  return {
    rows,
    loading,
    error,
    reload,
    saveTask,
    saveMeeting,
    saveCall,
    rowToDelete,
    setRowToDelete,
    deleting,
    confirmDelete,
  };
}
