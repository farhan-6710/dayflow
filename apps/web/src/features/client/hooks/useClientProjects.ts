import { useCallback, useMemo, useState } from "react";

import { useClientPortal } from "@/features/client/hooks/useClientPortal";
import { fetchProjectsForClientPortal } from "@/services/projectsService";
import { useLoadData } from "@/shared/hooks/useLoadData";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function useClientProjects() {
  const { client } = useClientPortal();
  const companyName = client.company_name;
  const [searchQuery, setSearchQuery] = useState("");

  const loader = useCallback(() => fetchProjectsForClientPortal(companyName), [companyName]);
  const { data, loading, error, reload } = useLoadData(loader, "Couldn't load your projects.");

  const projects = useMemo(
    () => (data ?? []).filter((project) => matchesListingSearch(searchQuery, [project.name])),
    [data, searchQuery],
  );

  return { projects, total: data?.length ?? 0, loading, error, reload, searchQuery, setSearchQuery };
}
