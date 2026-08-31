import { useCallback, useState } from "react";

import type {
  ClientActivityRaisedBy,
  CreateClientActivityCallInput,
  CreateClientActivityMeetingInput,
  CreateClientActivityTaskInput,
} from "@/features/admin/client-activities/types/types";
import {
  createClientActivityCall,
  createClientActivityMeeting,
  createClientActivityTask,
  deleteClientActivityCall,
  deleteClientActivityMeeting,
  deleteClientActivityTask,
  updateClientActivityCall,
  updateClientActivityMeeting,
  updateClientActivityTask,
} from "@/services/clientActivitiesService";
import { showToast } from "@/shared/utils/showToast";

type UseClientActivityActionsOptions = {
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
  raisedBy?: ClientActivityRaisedBy;
};

export function useClientActivityActions({
  reload,
  setError,
  raisedBy = "workspace",
}: UseClientActivityActionsOptions) {
  const [isSaving, setIsSaving] = useState(false);

  const runMutation = useCallback(
    async (
      action: () => Promise<unknown>,
      successMessage: string,
      failureFallback: string,
    ) => {
      if (isSaving) return;
      setIsSaving(true);
      setError(null);
      try {
        await action();
        showToast("success", successMessage);
        await reload();
      } catch (err) {
        const message = err instanceof Error ? err.message : failureFallback;
        setError(message);
        showToast("error", message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving, reload, setError],
  );

  const saveTask = useCallback(
    async (
      taskId: string | null,
      projectId: string,
      input: CreateClientActivityTaskInput,
    ) => {
      await runMutation(
        () =>
          taskId
            ? updateClientActivityTask(taskId, input)
            : createClientActivityTask(projectId, { ...input, raisedBy }),
        taskId ? "Task updated." : "Task created.",
        taskId ? "Failed to update task." : "Failed to create task.",
      );
    },
    [runMutation, raisedBy],
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      await runMutation(
        () => deleteClientActivityTask(taskId),
        "Task deleted.",
        "Failed to delete task.",
      );
    },
    [runMutation, raisedBy],
  );

  const saveMeeting = useCallback(
    async (
      meetingId: string | null,
      projectId: string,
      input: CreateClientActivityMeetingInput,
    ) => {
      await runMutation(
        () =>
          meetingId
            ? updateClientActivityMeeting(meetingId, input)
            : createClientActivityMeeting(projectId, { ...input, raisedBy }),
        meetingId ? "Meeting updated." : "Meeting created.",
        meetingId ? "Failed to update meeting." : "Failed to create meeting.",
      );
    },
    [runMutation, raisedBy],
  );

  const removeMeeting = useCallback(
    async (meetingId: string) => {
      await runMutation(
        () => deleteClientActivityMeeting(meetingId),
        "Meeting deleted.",
        "Failed to delete meeting.",
      );
    },
    [runMutation, raisedBy],
  );

  const saveCall = useCallback(
    async (
      callId: string | null,
      projectId: string,
      input: CreateClientActivityCallInput,
    ) => {
      await runMutation(
        () =>
          callId
            ? updateClientActivityCall(callId, input)
            : createClientActivityCall(projectId, { ...input, raisedBy }),
        callId ? "Call updated." : "Call created.",
        callId ? "Failed to update call." : "Failed to create call.",
      );
    },
    [runMutation, raisedBy],
  );

  const removeCall = useCallback(
    async (callId: string) => {
      await runMutation(
        () => deleteClientActivityCall(callId),
        "Call deleted.",
        "Failed to delete call.",
      );
    },
    [runMutation, raisedBy],
  );

  return {
    isSaving,
    saveTask,
    removeTask,
    saveMeeting,
    removeMeeting,
    saveCall,
    removeCall,
  };
}
