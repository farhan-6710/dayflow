import { type ActivityItem, type ActivityKind } from "@/features/activities/activityModel";
import { confirm } from "@/lib/confirm";
import { useAction } from "@/lib/query";
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
import type {
  ClientActivityStatus,
  CreateClientActivityCallInput,
  CreateClientActivityMeetingInput,
  CreateClientActivityTaskInput,
} from "@/shared/types/activities";

const invalidate = ["activities", "activity-counts", "client-overview"];

export type ActivityInput =
  | { kind: "task"; values: CreateClientActivityTaskInput }
  | { kind: "meeting"; values: CreateClientActivityMeetingInput }
  | { kind: "call"; values: CreateClientActivityCallInput };

export function useActivityActions() {
  const create = useAction(
    ({ projectId, input }: { projectId: string; input: ActivityInput }): Promise<unknown> => {
      if (input.kind === "task") return createClientActivityTask(projectId, input.values);
      if (input.kind === "meeting") return createClientActivityMeeting(projectId, input.values);
      return createClientActivityCall(projectId, input.values);
    },
    { success: "Activity added.", failure: "Couldn't add the activity.", invalidate, quietError: true },
  );
  const update = useAction(
    ({ id, input }: { id: string; input: ActivityInput }): Promise<unknown> => {
      if (input.kind === "task") return updateClientActivityTask(id, input.values);
      if (input.kind === "meeting") return updateClientActivityMeeting(id, input.values);
      return updateClientActivityCall(id, input.values);
    },
    { success: "Activity saved.", failure: "Couldn't save the activity.", invalidate, quietError: true },
  );
  const setStatus = useAction(
    ({ item, status }: { item: ActivityItem; status: ClientActivityStatus }): Promise<unknown> => {
      if (item.kind === "task") return updateClientActivityTask(item.id, { status });
      if (item.kind === "meeting") return updateClientActivityMeeting(item.id, { status });
      return updateClientActivityCall(item.id, { status });
    },
    { success: "Status updated.", failure: "Couldn't update the status.", invalidate },
  );
  const remove = useAction(
    ({ kind, id }: { kind: ActivityKind; id: string }): Promise<unknown> => {
      if (kind === "task") return deleteClientActivityTask(id);
      if (kind === "meeting") return deleteClientActivityMeeting(id);
      return deleteClientActivityCall(id);
    },
    { success: "Activity deleted.", failure: "Couldn't delete the activity.", invalidate },
  );

  return {
    create,
    update,
    setStatus,
    confirmDelete: async (item: ActivityItem) => {
      if (await confirm({ title: `Delete "${item.title}"?`, message: "It's removed for both you and the other side. This can't be undone.", confirmLabel: "Delete" })) {
        remove.mutate({ kind: item.kind, id: item.id });
      }
    },
  };
}
