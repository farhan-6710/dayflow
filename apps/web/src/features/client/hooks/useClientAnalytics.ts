import { useMemo } from "react";

import type { ActivityStatusRow, ProjectActivityRow } from "@/features/client/types/components";
import { useClientOverview } from "@/features/client/hooks/useClientOverview";

type Activity = { project_id: string; status: string };

function statusRow(name: string, items: Activity[]): ActivityStatusRow {
  const count = (status: string) => items.filter((item) => item.status === status).length;
  return { name, pending: count("pending"), inProgress: count("in_progress"), completed: count("completed") };
}

export function useClientAnalytics() {
  const overview = useClientOverview();
  const { projects, tasks, meetings, calls } = overview;

  return useMemo(() => {
    const all: Activity[] = [...tasks, ...meetings, ...calls];
    const completed = all.filter((item) => item.status === "completed").length;
    const projectRows: ProjectActivityRow[] = projects.map((project) => {
      const items = all.filter((item) => item.project_id === project.id);
      const done = items.filter((item) => item.status === "completed").length;
      return { id: project.id, name: project.name, color: project.color_hex, open: items.length - done, completed: done };
    });

    return {
      loading: overview.loading,
      error: overview.error,
      reload: overview.reload,
      total: all.length,
      completed,
      open: all.length - completed,
      completionRate: all.length > 0 ? Math.round((completed / all.length) * 100) : 0,
      statusRows: [statusRow("Tasks", tasks), statusRow("Meetings", meetings), statusRow("Calls", calls)],
      projectRows,
    };
  }, [overview, projects, tasks, meetings, calls]);
}
