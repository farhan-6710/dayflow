import { useCallback, useState } from "react";

import { DRAFT_PROJECT_NOTE_ID } from "@/features/admin/projects/constants/projectNotes";
import type { Note } from "@/services/notesService";

function buildDraftProjectNote(projectId: string, userId: string): Note {
  return {
    id: DRAFT_PROJECT_NOTE_ID,
    user_id: userId,
    project_id: projectId,
    title: "",
    body: null,
    created_at: "",
    updated_at: "",
  };
}

export function useDraftProjectNote(projectId: string | undefined, userId: string | undefined) {
  const [draftNote, setDraftNote] = useState<Note | null>(null);

  const startDraft = useCallback(() => {
    if (!projectId || !userId) return;
    setDraftNote((current) => current ?? buildDraftProjectNote(projectId, userId));
  }, [projectId, userId]);

  const discardDraft = useCallback(() => {
    setDraftNote(null);
  }, []);

  const isDraftId = useCallback(
    (id: string) => Boolean(draftNote && id === draftNote.id),
    [draftNote],
  );

  return {
    draftNote,
    startDraft,
    discardDraft,
    isDraftId,
  };
}
