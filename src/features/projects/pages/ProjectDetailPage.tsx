import { ArrowLeft, Folder, Pencil, Plus } from "lucide-react";
import { Link } from "react-router";

import { ProjectFormDialog } from "@/features/projects/components/ProjectFormDialog";
import { ProjectNotesTable } from "@/features/projects/components/ProjectNotesTable";
import { ProjectReferenceLinksSection } from "@/features/projects/components/ProjectReferenceLinksSection";
import { useProjectDetail } from "@/features/projects/hooks/useProjectDetail";
import {
  buildProjectNotePath,
  PROJECTS_MANAGEMENT_PATH,
} from "@/features/projects/constants/routes";
import {
  buildProjectDetailDescription,
  buildProjectDetailMeta,
  buildProjectNotesEmptyMessage,
} from "@/features/projects/utils/projectDetailDisplay";
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
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading project...</div>;
  }

  if (!project) return null;

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
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handleOpenEditDialog}>
              <Pencil className="mr-1 size-4" />
              Edit Project
            </Button>
            <Button asChild>
              <Link to={buildProjectNotePath(project.id, "new")}>
                <Plus className="mr-1 size-4" />
                Add Note
              </Link>
            </Button>
          </div>
        }
      />

      <PageContent>
        <div className={cn("space-y-6", containMinWidthClassName)}>
          <ProjectNotesTable
            projectId={project.id}
            notes={notes}
            isLoading={loading}
            onDeleteNote={handleDeleteNote}
            emptyMessage={buildProjectNotesEmptyMessage(project.name)}
          />

          <ProjectReferenceLinksSection
            referenceLinks={referenceLinks}
            canEdit={!project.is_archived}
            isSaving={savingReferenceLink}
            onAdd={handleAddReferenceLink}
            onUpdate={handleUpdateReferenceLink}
            onDelete={handleDeleteReferenceLink}
          />
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
