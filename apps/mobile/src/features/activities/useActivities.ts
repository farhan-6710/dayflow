import { useQuery } from "@tanstack/react-query";

import { callItem, meetingItem, taskItem, type ActivityBundle } from "@/features/activities/activityModel";
import {
  fetchClientActivityCallsByClientId,
  fetchClientActivityCallsByProjectId,
  fetchClientActivityMeetingsByClientId,
  fetchClientActivityMeetingsByProjectId,
  fetchClientActivityTasksByClientId,
  fetchClientActivityTasksByProjectId,
} from "@/services/clientActivitiesService";

export type ActivityScope = { kind: "project" | "client"; id: string };

export function useActivities(scope: ActivityScope) {
  return useQuery<ActivityBundle>({
    queryKey: ["activities", scope.kind, scope.id],
    queryFn: async () => {
      const byProject = scope.kind === "project";
      const [tasks, meetings, calls] = await Promise.all([
        byProject ? fetchClientActivityTasksByProjectId(scope.id) : fetchClientActivityTasksByClientId(scope.id),
        byProject ? fetchClientActivityMeetingsByProjectId(scope.id) : fetchClientActivityMeetingsByClientId(scope.id),
        byProject ? fetchClientActivityCallsByProjectId(scope.id) : fetchClientActivityCallsByClientId(scope.id),
      ]);
      return { tasks: tasks.map(taskItem), meetings: meetings.map(meetingItem), calls: calls.map(callItem) };
    },
  });
}
