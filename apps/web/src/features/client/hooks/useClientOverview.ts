import { useCallback, useMemo } from "react";

import { useClientPortal } from "@/features/client/hooks/useClientPortal";
import {
  fetchClientActivityCallsByClientId,
  fetchClientActivityMeetingsByClientId,
  fetchClientActivityTasksByClientId,
} from "@/services/clientActivitiesService";
import { fetchProjectsForClientPortal } from "@/services/projectsService";
import { useLoadData } from "@/shared/hooks/useLoadData";

/** Shared projects plus every activity on them, for this client. */
export function useClientOverview() {
  const { client } = useClientPortal();
  const clientId = client.id;
  const companyName = client.company_name;

  const loader = useCallback(async () => {
    const [projects, tasks, meetings, calls] = await Promise.all([
      fetchProjectsForClientPortal(companyName),
      fetchClientActivityTasksByClientId(clientId),
      fetchClientActivityMeetingsByClientId(clientId),
      fetchClientActivityCallsByClientId(clientId),
    ]);
    return { projects, tasks, meetings, calls };
  }, [clientId, companyName]);
  const { data, loading, error, reload } = useLoadData(loader, "Couldn't load your projects and activities.");

  return useMemo(
    () => ({
      client,
      projects: data?.projects ?? [],
      tasks: data?.tasks ?? [],
      meetings: data?.meetings ?? [],
      calls: data?.calls ?? [],
      loading,
      error,
      reload,
    }),
    [client, data, loading, error, reload],
  );
}
