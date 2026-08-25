import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router";

import { PROJECT_FOR_LABEL } from "@/features/projects/constants/projectFor";
import { ProjectNotesTable } from "@/features/projects/components/ProjectNotesTable";
import { useProjectDetail } from "@/features/projects/hooks/useProjectDetail";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function ProjectDetailPage() {
  const { project, notes, loading, handleDeleteNote } = useProjectDetail();

  if (loading && !project) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading project...</div>;
  }

  if (!project) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        heading={project.name}
        description="Project details and notes for this folder."
        backButton={
          <Link
            to="/projects-management"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to Projects Management
          </Link>
        }
        actions={
          <Button asChild>
            <Link to={`/projects-management/${project.id}/notes/new`}>
              <Plus className="mr-1 size-4" />
              Add Note
            </Link>
          </Button>
        }
      />

      <PageContent>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {PROJECT_FOR_LABEL}
              </dt>
              <dd className="mt-1 text-sm font-medium">{project.project_for_label}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {project.is_archived ? "Archived" : "Active"}
              </dd>
            </div>
          </dl>
        </div>

        <ProjectNotesTable
          projectId={project.id}
          notes={notes}
          isLoading={loading}
          onDeleteNote={handleDeleteNote}
        />
      </PageContent>
    </div>
  );
}

export default ProjectDetailPage;
