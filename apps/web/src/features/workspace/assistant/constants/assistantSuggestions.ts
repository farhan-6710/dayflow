import { CalendarDays, CircleCheck, FolderKanban, ListTodo, type LucideIcon } from "lucide-react";

export type AssistantSuggestion = {
  label: string;
  icon: LucideIcon;
};

/** Starter questions on the empty assistant panel; each one maps to a tool the assistant has. */
export const ASSISTANT_SUGGESTIONS: AssistantSuggestion[] = [
  { label: "Show my pending tasks", icon: CircleCheck },
  { label: "How do I create a new task?", icon: ListTodo },
  { label: "View today's schedule", icon: CalendarDays },
  { label: "Summarize my projects", icon: FolderKanban },
];

export const ASSISTANT_NAME = "DayFlow Assistant";
export const ASSISTANT_SHORTCUT_KEY = "j";
