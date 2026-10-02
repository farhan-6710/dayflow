export const NOTE_CATEGORIES = [
  "general",
  "meeting",
  "research",
  "decision",
  "reference",
] as const;

export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

export const DEFAULT_NOTE_CATEGORY: NoteCategory = "general";

export const NOTE_CATEGORY_LABELS: Record<NoteCategory, string> = {
  general: "General",
  meeting: "Meeting",
  research: "Research",
  decision: "Decision",
  reference: "Reference",
};

export const NOTE_CATEGORY_FILTER_ALL = "all";

export type NoteCategoryFilterId = typeof NOTE_CATEGORY_FILTER_ALL | NoteCategory;

export function isNoteCategory(value: string | null | undefined): value is NoteCategory {
  return NOTE_CATEGORIES.includes(value as NoteCategory);
}

export function getNoteCategoryLabel(category: string | null | undefined): string {
  if (isNoteCategory(category)) {
    return NOTE_CATEGORY_LABELS[category];
  }
  return NOTE_CATEGORY_LABELS[DEFAULT_NOTE_CATEGORY];
}
