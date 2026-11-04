import type { Note, Project, ReferenceLink } from "@/shared/types/types";
import type { useProjectsManagement } from "@/features/workspace/projects/hooks/useProjectsManagement";

export type ProjectsTableProps = {
  page: ReturnType<typeof useProjectsManagement>;
};

export type ProjectsTableRowProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onToggleActive: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export type ProjectNotesTableProps = {
  projectId: string;
  projectName: string;
  notes: Note[];
  canAddNote: boolean;
  onDeleteNote: (note: Note) => Promise<void>;
  onReorderNotes: (orderedIds: string[]) => void;
};

export type ProjectNotesTableRowProps = {
  projectId: string;
  note: Note;
  onDelete: (note: Note) => void;
};

export type ReferenceLinkInput = {
  url: string;
  label: string | null;
};

export type ReferenceLinksApi<T extends ReferenceLink> = {
  create: (input: ReferenceLinkInput) => Promise<T>;
  update: (id: string, input: ReferenceLinkInput) => Promise<T>;
  remove: (id: string) => Promise<void>;
};

export type ReferenceLinksSectionProps<T extends ReferenceLink> = {
  links: T[];
  canEdit: boolean;
  /** "project" or "note": used in the copy. */
  ownerLabel: string;
  api: ReferenceLinksApi<T>;
  onLinksChange: (update: (links: T[]) => T[]) => void;
};

export type ReferenceLinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: ReferenceLink | null;
  ownerLabel: string;
  onSave: (input: ReferenceLinkInput) => Promise<void>;
  /** Edit only: opens the delete confirmation flow. */
  onDelete?: (link: ReferenceLink) => void;
};

export type NoteSavePayload = {
  title: string;
  body: string | null;
  category: Note["category"];
};

export type ProjectNoteEditorProps = {
  note: Note | null;
  canEdit: boolean;
  /** Returns the created note's id when this was a draft. */
  onSave: (payload: NoteSavePayload) => Promise<string | null>;
  onCreated: (noteId: string) => void;
  onDuplicate: () => void | Promise<void>;
  onDelete: () => void;
  onDiscard: () => void;
};
