import { useState } from "react";
import {
  ArrowLeft,
  CircleOff,
  Folder,
  Pencil,
  RotateCcw,
  Trash2,
  UserRound,
} from "lucide-react";
import { Link } from "react-router";

import { ProjectFormDialog } from "@/features/workspace/projects/components/ProjectFormDialog";
import { ProjectNotesTable } from "@/features/workspace/projects/components/ProjectNotesTable";
import { ProjectReferenceLinksSection } from "@/features/workspace/projects/components/ProjectReferenceLinksSection";
import { ClientActivitiesBlock } from "@/features/workspace/client-activities/components/ClientActivitiesBlock";
import { buildClientDetailPath } from "@/features/workspace/clients-management/constants/routes";
import { useProjectDetail } from "@/features/workspace/projects/hooks/useProjectDetail";
import { PROJECTS_MANAGEMENT_PATH } from "@/features/workspace/projects/constants/routes";
import {
  buildProjectDetailDescription,
  buildProjectDetailMeta,
  buildProjectNotesEmptyMessage,
} from "@/features/workspace/projects/utils/projectDetailDisplay";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
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
    updatingStatus,
    deletingProject,
    handleDeleteNote,
    handleOpenEditDialog,
    handleSubmitProject,
    handleAddReferenceLink,
    handleUpdateReferenceLink,
    handleDeleteReferenceLink,
    handleToggleActive,
    handleDeleteProject,
  } = useProjectDetail();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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
          <>
            {isClientProject ? (
              <Button variant="outline" asChild>
                <Link to={buildClientDetailPath(project.project_for!)}>
                  <UserRound className="mr-1 size-4" />
                  View client
                </Link>
              </Button>
            ) : null}
            <Button
              variant="outline"
              onClick={() => void handleToggleActive()}
              disabled={updatingStatus}
            >
              {project.is_active ? (
                <CircleOff className="mr-1 size-4" />
              ) : (
                <RotateCcw className="mr-1 size-4" />
              )}
              {project.is_active ? "Mark inactive" : "Mark active"}
            </Button>
            <Button
              variant="outline"
              onClick={handleOpenEditDialog}
              disabled={!project.is_active}
            >
              <Pencil className="mr-1 size-4" />
              Edit Project
            </Button>
            <Button
              variant="destructive-outline"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="mr-1 size-4" />
              Delete
            </Button>
          </>
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
        onDelete={async () => {
          await handleDeleteProject();
        }}
      />

      <ConfirmationModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Project?"
        description="This action is irreversible. All notes in this project will be deleted forever."
        confirmLabel="Delete permanently"
        confirmVariant="destructive"
        loading={deletingProject}
        onConfirm={async () => {
          await handleDeleteProject();
          setDeleteConfirmOpen(false);
        }}
      />
    </div>
  );
}

export default ProjectDetailPage;
