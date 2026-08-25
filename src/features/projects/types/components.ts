import type { Note } from "@/services/notesService";

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
};

export type ProjectNotesTableRowProps = {
  projectId: string;
  note: Note;
  onDeleteNote: (note: Note) => void;
};

export type ProjectForSelectProps = {
  value: string;
  onChange: (value: string) => void;
  clients: import("@/features/clients-management/types/types").Client[];
  disabled?: boolean;
};
