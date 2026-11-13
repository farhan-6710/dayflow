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

/** Matches ASSISTANT_NAME in supabase/functions/assistant/assistantInstructions.ts. */
export const ASSISTANT_NAME = "Flowy";
export const ASSISTANT_SHORTCUT_KEY = "j";
