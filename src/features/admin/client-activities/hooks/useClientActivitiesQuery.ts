import { useCallback, useEffect, useState } from "react";

import type {
  ClientActivityCall,
  ClientActivityMeeting,
  ClientActivityTask,
} from "@/features/admin/client-activities/types/types";
import type { Project } from "@/services/projectsService";
import {
  fetchClientActivityCallsByClientId,
  fetchClientActivityCallsByProjectId,
  fetchClientActivityMeetingsByClientId,
  fetchClientActivityMeetingsByProjectId,
  fetchClientActivityTasksByClientId,
  fetchClientActivityTasksByProjectId,
} from "@/services/clientActivitiesService";
import { fetchProjectsByClientId, fetchProjectsForClientPortal } from "@/services/projectsService";

export type ClientActivitiesQueryScope =
  | { scope: "project"; projectId: string }
  | {
      scope: "client";
      clientId: string;
      /** Admin portal: admin auth user id. Omit when forClientPortal is true. */
      userId?: string;
      forClientPortal?: boolean;
      clientCompanyName?: string | null;
    };

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
  const forClientPortal =
    scope?.scope === "client" ? scope.forClientPortal === true : false;
  const clientCompanyName =
    scope?.scope === "client" ? scope.clientCompanyName : undefined;
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
      } else if (scopeKind === "client" && clientId) {
        const projectFetch = forClientPortal
          ? fetchProjectsForClientPortal(clientCompanyName, clientId)
          : userId
            ? fetchProjectsByClientId(userId, clientId)
            : Promise.resolve([]);

        const [taskRows, meetingRows, callRows, projectRows] = await Promise.all([
          fetchClientActivityTasksByClientId(clientId),
          fetchClientActivityMeetingsByClientId(clientId),
          fetchClientActivityCallsByClientId(clientId),
          projectFetch,
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
  }, [scopeKind, projectId, clientId, userId, forClientPortal, clientCompanyName]);

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
