export type NoteReferenceLink = {
  id: string;
  note_id: string;
  user_id: string;
  url: string;
  label: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateNoteReferenceLinkInput = {
  url: string;
  label?: string | null;
};
