import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { ProjectNotesWorkspace } from "@/features/projects/components/ProjectNotesWorkspace";
import { useProjectDetail } from "@/features/projects/hooks/useProjectDetail";
import { PageHeader } from "@/shared/components/PageHeader";
import { containMinWidthClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

export function ProjectDetailPage() {
  const {
    project,
    notes,
    loading,
    draftNote,
    selectedNoteId,
    selectNote,
    startDraft,
    discardDraft,
    handleSaveNote,
    handleDuplicateNote,
    handleDeleteNote,
  } = useProjectDetail();

  if (loading && !project) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading project...</div>;
  }

  if (!project) return null;

  return (
    <div className={cn("flex h-[calc(100vh-120px)] flex-col space-y-6", containMinWidthClassName)}>
      <PageHeader
        heading={project.name}
        description="Project workspace for organizing related notes."
        backButton={
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to Projects
          </Link>
        }
      />

      <ProjectNotesWorkspace
        notes={notes}
        draftNote={draftNote}
        selectedNoteId={selectedNoteId}
        loading={loading}
        onSelect={selectNote}
        onStartDraft={startDraft}
        onSave={handleSaveNote}
        onDuplicate={handleDuplicateNote}
        onDelete={handleDeleteNote}
        onDiscard={discardDraft}
      />
    </div>
  );
}
