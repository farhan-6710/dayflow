import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/AuthProvider";
import {
  fetchClientActivityCallsByClientId,
  fetchClientActivityMeetingsByClientId,
  fetchClientActivityTasksByClientId,
} from "@/services/clientActivitiesService";
import { fetchProjectsForClientPortal } from "@/services/projectsService";
import type { Client } from "@/shared/types/types";

/** The linked client record. The route guard guarantees it exists on client screens. */
export function usePortalClient(): Client {
  const { client } = useAuth();
  if (!client) throw new Error("usePortalClient needs a linked client");
  return client;
}

export function usePortalProjects() {
  const client = usePortalClient();
  return useQuery({ queryKey: ["projects", "portal", client.id], queryFn: () => fetchProjectsForClientPortal(client.company_name) });
}

/** Every activity on this client's shared projects. */
export function useClientOverview() {
  const client = usePortalClient();
  return useQuery({
    queryKey: ["client-overview", client.id],
    queryFn: async () => {
      const [tasks, meetings, calls] = await Promise.all([
        fetchClientActivityTasksByClientId(client.id),
        fetchClientActivityMeetingsByClientId(client.id),
        fetchClientActivityCallsByClientId(client.id),
      ]);
      return { tasks, meetings, calls };
    },
  });
}
