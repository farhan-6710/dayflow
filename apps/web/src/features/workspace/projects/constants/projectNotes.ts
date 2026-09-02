export const NOTE_BODY_PREVIEW_LINES = 8;

export const DRAFT_PROJECT_NOTE_ID = "draft";

export function formatNoteIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}
