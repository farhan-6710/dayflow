import { useCallback, useEffect, useState } from "react";

import type {
  ClientActivityCall,
  ClientActivityMeeting,
  ClientActivityTask,
} from "@/features/client-activities/types/types";
import type { Project } from "@/services/projectsService";
import {
  fetchClientActivityCallsByClientId,
  fetchClientActivityCallsByProjectId,
  fetchClientActivityMeetingsByClientId,
  fetchClientActivityMeetingsByProjectId,
  fetchClientActivityTasksByClientId,
  fetchClientActivityTasksByProjectId,
} from "@/services/clientActivitiesService";
import { fetchProjectsByClientId } from "@/services/projectsService";

export type ClientActivitiesQueryScope =
  | { scope: "project"; projectId: string }
  | { scope: "client"; clientId: string; userId: string };

export function useClientActivitiesQuery(scope: ClientActivitiesQueryScope | null) {
  const [tasks, setTasks] = useState<ClientActivityTask[]>([]);
  const [meetings, setMeetings] = useState<ClientActivityMeeting[]>([]);
  const [calls, setCalls] = useState<ClientActivityCall[]>([]);
  const [clientProjects, setClientProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(Boolean(scope));
  const [error, setError] = useState<string | null>(null);

  const projectId = scope?.scope === "project" ? scope.projectId : undefined;
  const clientId = scope?.scope === "client" ? scope.clientId : undefined;
  const userId = scope?.scope === "client" ? scope.userId : undefined;
  const scopeKind = scope?.scope ?? "none";

  const reload = useCallback(async () => {
    if (scopeKind === "none") {
      setTasks([]);
      setMeetings([]);
      setCalls([]);
      setClientProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (scopeKind === "project" && projectId) {
        const [taskRows, meetingRows, callRows] = await Promise.all([
          fetchClientActivityTasksByProjectId(projectId),
          fetchClientActivityMeetingsByProjectId(projectId),
          fetchClientActivityCallsByProjectId(projectId),
        ]);
        setTasks(taskRows);
        setMeetings(meetingRows);
        setCalls(callRows);
        setClientProjects([]);
      } else if (scopeKind === "client" && clientId && userId) {
        const [taskRows, meetingRows, callRows, projectRows] = await Promise.all([
          fetchClientActivityTasksByClientId(clientId),
          fetchClientActivityMeetingsByClientId(clientId),
          fetchClientActivityCallsByClientId(clientId),
          fetchProjectsByClientId(userId, clientId),
        ]);
        setTasks(taskRows);
        setMeetings(meetingRows);
        setCalls(callRows);
        setClientProjects(projectRows);
      }
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to load client activities.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [scopeKind, projectId, clientId, userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    tasks,
    meetings,
    calls,
    clientProjects,
    loading,
    error,
    setError,
    reload,
  };
}
