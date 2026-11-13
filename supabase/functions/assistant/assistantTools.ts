/**
 * Tool declarations sent to Gemini. The browser runs them
 * (apps/web/src/features/workspace/assistant/utils/assistantTools.ts) with the signed-in user's own
 * Supabase session, so RLS still applies. Keep names in sync.
 */
const DATE = { type: "string", description: "Date as YYYY-MM-DD." };

export const ASSISTANT_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "find_projects",
        description: "Finds the user's projects by name or client, with links. An empty query lists all.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: 'Words to match in the project or client name, e.g. "redesign".' },
            active_only: { type: "boolean", description: "Only active projects." },
          },
        },
      },
      {
        name: "find_clients",
        description: "Finds the user's clients by company or contact name, with links. An empty query lists all.",
        parameters: { type: "object", properties: { query: { type: "string" } } },
      },
      {
        name: "get_tasks",
        description: "Lists tasks filtered by status, due-date range and words in the title. Sorted by due date.",
        parameters: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["todo", "in_progress", "done", "missed", "open"], description: '"open" means todo or in_progress.' },
            from: DATE,
            to: DATE,
            query: { type: "string", description: "Words to match in the task title." },
          },
        },
      },
      {
        name: "get_schedule",
        description: "Everything for one day: tasks due that day, overdue open tasks, and reminders that ring that day.",
        parameters: { type: "object", properties: { date: { ...DATE, description: "Day as YYYY-MM-DD. Omit for today." } } },
      },
      {
        name: "get_todos",
        description: "The user's quick todos from the dashboard.",
        parameters: { type: "object", properties: { status: { type: "string", enum: ["pending", "completed"] } } },
      },
      {
        name: "search_notes",
        description: "Searches project notes by title and text, newest first, with links. An empty query returns recent notes.",
        parameters: { type: "object", properties: { query: { type: "string" } } },
      },
    ],
  },
];
