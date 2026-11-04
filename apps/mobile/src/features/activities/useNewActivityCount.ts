import { useQuery } from "@tanstack/react-query";

import { useLastSeen } from "@/lib/useLastSeen";
import { countActivitiesRaisedSince } from "@/services/clientActivitiesService";
import type { ClientActivityRaisedBy } from "@/shared/types/activities";

/** How many activities the other side raised since this person's last visit. No server involved: it reads what RLS already shows them. */
export function useNewActivityCount(fromSide: ClientActivityRaisedBy) {
  const since = useLastSeen(`activity-summary:${fromSide}`);
  const query = useQuery({
    queryKey: ["activities", "new-count", fromSide, since],
    queryFn: () => countActivitiesRaisedSince(fromSide, since as string),
    enabled: Boolean(since),
  });
  return query.data ?? 0;
}
