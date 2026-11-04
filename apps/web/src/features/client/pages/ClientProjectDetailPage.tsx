import { useCallback } from "react";
import { useParams } from "react-router";

import { CLIENT_PORTAL_PROJECTS_PATH } from "@/app/constants/clientPortalRoutes";
import { useClientPortal } from "@/features/client/hooks/useClientPortal";
import { ClientActivitiesBlock } from "@/features/workspace/client-activities/components/ClientActivitiesBlock";
import { ClientActivitiesSkeleton } from "@/features/workspace/client-activities/components/ClientActivitiesSkeleton";
import { fetchProjectsForClientPortal } from "@/services/projectsService";
import { BackLink } from "@/shared/components/BackLink";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { Phantom } from "@/shared/components/Phantom";
import { ProjectChip } from "@/shared/components/ProjectChip";
import { StatusPill } from "@/shared/components/StatusPill";
import { usePageBreadcrumbs } from "@/shared/hooks/usePageBreadcrumbs";
import { useLoadData } from "@/shared/hooks/useLoadData";

const backLink = <BackLink to={CLIENT_PORTAL_PROJECTS_PATH}>Projects</BackLink>;

export function ClientProjectDetailPage() {
  const { id: projectId = "" } = useParams<{ id: string }>();
  const { client } = useClientPortal();
  const companyName = client.company_name;

  const loader = useCallback(async () => {
    const projects = await fetchProjectsForClientPortal(companyName);
    return projects.find((project) => project.id === projectId) ?? null;
  }, [companyName, projectId]);
  const { data: project, loading, error, reload } = useLoadData(loader, "Couldn't load this project.");
  usePageBreadcrumbs(project ? [{ label: project.name }] : []);

  if (loading) {
    return (
      <Phantom>
        <PageHeader heading="A project name" description="Active" />
        <ClientActivitiesSkeleton title="Activities" />
      </Phantom>
    );
  }
  if (error) {
    return (
      <div className="space-y-3">
        {backLink}
        <ErrorBanner message={error} onRetry={reload} />
      </div>
    );
  }
  if (!project) {
    return (
      <div className="space-y-3">
        {backLink}
        <EmptyState
          image="icon-empty-projects"
          title="Project not found"
          description="It may no longer be shared with you, or the link is out of date."
        />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        heading={
          <span className="flex min-w-0 items-center gap-3">
            <ProjectChip color={project.color_hex} className="size-11" />
            <span className="min-w-0 break-words">{project.name}</span>
          </span>
        }
        description={<StatusPill active={project.is_active}>{project.is_active ? "Active" : "Inactive"}</StatusPill>}
      />
      <ClientActivitiesBlock
        scope="project"
        projectId={project.id}
        canEdit={project.is_active}
        activityRaisedBy="client"
      />
    </>
  );
}
