export const NOTE_CATEGORIES = ["general", "meeting", "research", "decision", "reference"] as const;

export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

export const NOTE_CATEGORY_LABELS: Record<NoteCategory, string> = {
  general: "General",
  meeting: "Meeting",
  research: "Research",
  decision: "Decision",
  reference: "Reference",
};

export function isNoteCategory(value: string | null | undefined): value is NoteCategory {
  return NOTE_CATEGORIES.includes(value as NoteCategory);
}

export function noteCategoryLabel(category: string | null | undefined): string {
  return isNoteCategory(category) ? NOTE_CATEGORY_LABELS[category] : "No category";
}
