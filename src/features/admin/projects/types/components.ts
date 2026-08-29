import type { Note } from "@/services/notesService";
import type { Project } from "@/services/projectsService";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";

export type ProjectsTableProps = {
  projects: Project[];
  isLoading: boolean;
  statusFilter: ActiveStatusFilterId;
  onStatusFilterChange: (filter: ActiveStatusFilterId) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onEditProject: (project: Project) => void;
  onToggleArchive: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
};

export type ProjectsTableRowProps = {
  project: Project;
  onEditProject: (project: Project) => void;
  onToggleArchive: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
};

export type ProjectNoteSavePayload = {
  title: string;
  body: string | null;
};

export type ProjectNotesListProps = {
  notes: Note[];
  draftNote: Note | null;
  selectedNoteId: string | null;
  loading: boolean;
  onSelect: (noteId: string) => void;
  onDelete: (noteId: string) => void;
};

export type ProjectNoteEditorProps = {
  note: Note | null;
  isDraft: boolean;
  saving: boolean;
  onSave: (noteId: string, payload: ProjectNoteSavePayload) => Promise<void>;
  onDuplicate: (note: Note) => Promise<void>;
  onDelete: (noteId: string) => void;
  onDiscard?: () => void;
};

export type ProjectNotesWorkspaceProps = {
  notes: Note[];
  draftNote: Note | null;
  selectedNoteId: string | null;
  loading: boolean;
  onSelect: (noteId: string) => void;
  onStartDraft: () => void;
  onSave: (noteId: string, payload: ProjectNoteSavePayload) => Promise<void>;
  onDuplicate: (note: Note) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
  onDiscard: () => void;
};

export type ProjectNotesTableProps = {
  projectId: string;
  notes: Note[];
  isLoading: boolean;
  onDeleteNote: (note: Note) => void | Promise<void>;
  emptyMessage?: string;
};

export type ProjectFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  submitting: boolean;
  projectName: string;
  onProjectNameChange: (value: string) => void;
  projectColor: string;
  onProjectColorChange: (value: string) => void;
  projectFor: string;
  onProjectForChange: (value: string) => void;
  clients: import("@/features/admin/clients-management/types/types").Client[];
  onSubmit: (event: React.FormEvent) => void | Promise<void>;
};

export type ProjectNotesTableRowProps = {
  projectId: string;
  note: Note;
  onDeleteNote: (note: Note) => void;
};

export type ProjectForSelectProps = {
  value: string;
  onChange: (value: string) => void;
  clients: import("@/features/admin/clients-management/types/types").Client[];
  disabled?: boolean;
};

export type ProjectReferenceLinksSectionProps = {
  referenceLinks: import("@/features/admin/projects/types/referenceLinks").ProjectReferenceLink[];
  canEdit: boolean;
  isSaving?: boolean;
  onAdd: (
    input: import("@/features/admin/projects/types/referenceLinks").CreateProjectReferenceLinkInput,
  ) => Promise<void>;
  onUpdate: (
    linkId: string,
    input: import("@/features/admin/projects/types/referenceLinks").CreateProjectReferenceLinkInput,
  ) => Promise<void>;
  onDelete: (linkId: string) => Promise<void>;
};
