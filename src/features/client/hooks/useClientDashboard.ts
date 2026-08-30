import { useEffect, useMemo, useState } from "react";

import { useClientActivitiesQuery } from "@/features/admin/client-activities/hooks/useClientActivitiesQuery";
import { isClientActivityOpen } from "@/features/admin/client-activities/utils/activityFormUtils";
import { fetchProjectsForClientPortal } from "@/services/projectsService";

export type ClientDashboardStats = {
  activeProjects: number;
  tasksOpen: number;
  tasksTotal: number;
  meetingsOpen: number;
  meetingsTotal: number;
  callsOpen: number;
  callsTotal: number;
};

export function useClientDashboard(
  clientId: string,
  clientCompanyName: string,
) {
  const [activeProjectCount, setActiveProjectCount] = useState(0);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        setProjectsLoading(true);
        const rows = await fetchProjectsForClientPortal(clientCompanyName, clientId);
        if (active) {
          setActiveProjectCount(rows.length);
        }
      } finally {
        if (active) {
          setProjectsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [clientId, clientCompanyName]);

  const queryScope = useMemo(
    () =>
      clientId
        ? {
            scope: "client" as const,
            clientId,
            forClientPortal: true as const,
            clientCompanyName,
          }
        : null,
    [clientId, clientCompanyName],
  );

  const { tasks, meetings, calls, loading: activitiesLoading } =
    useClientActivitiesQuery(queryScope);

  const stats = useMemo<ClientDashboardStats>(() => {
    const openTasks = tasks.filter((task) => isClientActivityOpen(task.status));
    const openMeetings = meetings.filter((meeting) =>
      isClientActivityOpen(meeting.status),
    );
    const openCalls = calls.filter((call) => isClientActivityOpen(call.status));

    return {
      activeProjects: activeProjectCount,
      tasksOpen: openTasks.length,
      tasksTotal: tasks.length,
      meetingsOpen: openMeetings.length,
      meetingsTotal: meetings.length,
      callsOpen: openCalls.length,
      callsTotal: calls.length,
    };
  }, [activeProjectCount, tasks, meetings, calls]);

  return {
    stats,
    loading: projectsLoading || activitiesLoading,
  };
}
