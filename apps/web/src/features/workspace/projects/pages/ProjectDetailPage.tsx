import { ArrowLeft, Folder, Pencil } from "lucide-react";
import { Link } from "react-router";

import { ProjectFormDialog } from "@/features/workspace/projects/components/ProjectFormDialog";
import { ProjectNotesTable } from "@/features/workspace/projects/components/ProjectNotesTable";
import { ProjectReferenceLinksSection } from "@/features/workspace/projects/components/ProjectReferenceLinksSection";
import { ClientActivitiesBlock } from "@/features/workspace/client-activities/components/ClientActivitiesBlock";
import { useProjectDetail } from "@/features/workspace/projects/hooks/useProjectDetail";
import {
  PROJECTS_MANAGEMENT_PATH,
} from "@/features/workspace/projects/constants/routes";
import {
  buildProjectDetailDescription,
  buildProjectDetailMeta,
  buildProjectNotesEmptyMessage,
} from "@/features/workspace/projects/utils/projectDetailDisplay";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { containMinWidthClassName } from "@/shared/constants/layoutStyles";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function ProjectDetailPage() {
  const {
    project,
    notes,
    referenceLinks,
    clients,
    loading,
    error,
    dialogOpen,
    setDialogOpen,
    projectName,
    setProjectName,
    projectColor,
    setProjectColor,
    projectFor,
    setProjectFor,
    submitting,
    savingReferenceLink,
    handleDeleteNote,
    handleOpenEditDialog,
    handleSubmitProject,
    handleAddReferenceLink,
    handleUpdateReferenceLink,
    handleDeleteReferenceLink,
  } = useProjectDetail();

  if (loading && !project) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Loading project...
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="space-y-4 py-6">
        <ErrorBanner message={error} />
        <Link
          to={PROJECTS_MANAGEMENT_PATH}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Projects Management
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Project not found.
      </div>
    );
  }

  const isClientProject = project.project_for !== null;

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
        description={
          <>
            {buildProjectDetailDescription(project)}
            <span className="mt-1 block text-xs text-muted-foreground/90">
              {buildProjectDetailMeta(project, notes)}
            </span>
          </>
        }
        backButton={
          <Link
            to={PROJECTS_MANAGEMENT_PATH}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to Projects Management
          </Link>
        }
        actions={
          <Button variant="outline" onClick={handleOpenEditDialog}>
            <Pencil className="mr-1 size-4" />
            Edit Project
          </Button>
        }
      />

      <PageContent>
        <div className={cn("space-y-6", containMinWidthClassName)}>
          {error ? <ErrorBanner message={error} /> : null}

          <ProjectNotesTable
            projectId={project.id}
            notes={notes}
            isLoading={loading}
            onDeleteNote={handleDeleteNote}
            emptyMessage={buildProjectNotesEmptyMessage(project.name)}
            canAddNote={project.is_active}
          />

          <ProjectReferenceLinksSection
            referenceLinks={referenceLinks}
            canEdit={project.is_active}
            isLoading={loading}
            isSaving={savingReferenceLink}
            onAdd={handleAddReferenceLink}
            onUpdate={handleUpdateReferenceLink}
            onDelete={handleDeleteReferenceLink}
          />

          {isClientProject ? (
            <ClientActivitiesBlock
              scope="project"
              projectId={project.id}
              canEdit={project.is_active}
            />
          ) : null}
        </div>
      </PageContent>

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing
        submitting={submitting}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        projectColor={projectColor}
        onProjectColorChange={setProjectColor}
        projectFor={projectFor}
        onProjectForChange={setProjectFor}
        clients={clients}
        onSubmit={handleSubmitProject}
      />
    </div>
  );
}

export default ProjectDetailPage;
