import { useEffect, useState } from "react";

import { buildClientProjectDetailPath } from "@/app/constants/clientPortalRoutes";
import { useClientPortal } from "@/features/client/providers/ClientPortalProvider";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { fetchProjectsForClientPortal, type Project } from "@/services/projectsService";

const GRID_CLASS = "grid-cols-[minmax(0,1fr)_8rem]";

export function ClientProjectsPage() {
  const { client } = useClientPortal();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const rows = await fetchProjectsForClientPortal();
        setProjects(rows);
      } finally {
        setLoading(false);
      }
    })();
  }, [client.id]);

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Projects"
        description="Projects your provider has shared with you."
      />
      <PageContent>
        <DirectoryTable
          title="Your projects"
          description="Select a project to view details and activities."
          gridClass={GRID_CLASS}
          columns={[{ label: "Project" }, { label: "Status" }]}
          emptyMessage="No projects have been shared with you yet."
          isLoading={loading}
          isEmpty={projects.length === 0}
        >
          {projects.map((project) => (
            <DirectoryTableRow
              key={project.id}
              to={buildClientProjectDetailPath(project.id)}
              className={`grid items-center gap-4 px-6 py-4 ${GRID_CLASS}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="inline-flex size-8 shrink-0 rounded-lg"
                  style={{ backgroundColor: project.color_hex }}
                  aria-hidden="true"
                />
                <span className="truncate font-medium">{project.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {project.is_archived ? "Archived" : "Active"}
              </span>
            </DirectoryTableRow>
          ))}
        </DirectoryTable>
      </PageContent>
    </div>
  );
}
