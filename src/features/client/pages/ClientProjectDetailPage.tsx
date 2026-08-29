import { ArrowLeft, Folder } from "lucide-react";
import { Link, useParams } from "react-router";

import { ClientActivitiesBlock } from "@/features/admin/client-activities/components/ClientActivitiesBlock";
import { CLIENT_PORTAL_PROJECTS_PATH } from "@/app/constants/clientPortalRoutes";
import { useClientPortal } from "@/features/client/providers/ClientPortalProvider";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { fetchProjectById, type Project } from "@/services/projectsService";
import { useEffect, useState } from "react";

export function ClientProjectDetailPage() {
  const { id: projectId = "" } = useParams();
  const { client } = useClientPortal();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    void (async () => {
      try {
        setLoading(true);
        const row = await fetchProjectById(projectId);
        setProject(row);
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  if (loading && !project) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Loading project...
      </div>
    );
  }

  if (!project || project.project_for !== client.id) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Project not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading={
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
              style={{ backgroundColor: project.color_hex }}
              aria-hidden="true"
            >
              <Folder className="size-5" />
            </span>
            <span className="truncate">{project.name}</span>
          </div>
        }
        description="Project overview and shared activities."
        backButton={
          <Link
            to={CLIENT_PORTAL_PROJECTS_PATH}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to Projects
          </Link>
        }
      />

      <PageContent>
        <ClientActivitiesBlock
          scope="project"
          projectId={project.id}
          canEdit
          activityRaisedBy="client"
        />
      </PageContent>
    </div>
  );
}
