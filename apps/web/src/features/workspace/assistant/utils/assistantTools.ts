/**
 * Runs the assistant's tool calls in the browser with the signed-in user's own Supabase session, so
 * RLS decides what it can see. Declarations live in supabase/functions/assistant/assistantTools.ts.
 */
import { format } from "date-fns";

import {
  buildClientPath,
  buildProjectNotePath,
  buildProjectPath,
  WORKSPACE_DAILY_REMINDERS_PATH,
  WORKSPACE_TASKS_CALENDAR_PATH,
} from "@/app/constants/workspaceRoutes";
import { fetchClients } from "@/services/clientsService";
import { fetchNotes } from "@/services/notesService";
import { fetchProjects } from "@/services/projectsService";
import { fetchReminders } from "@/services/remindersService";
import { fetchTasks } from "@/services/tasksService";
import { fetchTodos } from "@/services/todosService";
import type { AssistantToolArgs, AssistantToolResult } from "@/shared/types/assistant";
import type { ReminderDayKey, Task } from "@/shared/types/types";
import { parseDateValue, serializeDateValue } from "@/shared/utils/dateValue";

const MAX_RESULTS = 10;
const SNIPPET_LENGTH = 160;
const OPEN_STATUSES = new Set(["todo", "in_progress"]);
const WEEKDAY_KEYS: ReminderDayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

type Tool = (userId: string, args: AssistantToolArgs) => Promise<AssistantToolResult>;

function text(args: AssistantToolArgs, key: string): string | undefined {
  const value = args[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function matches(haystack: string, query: string | undefined): boolean {
  if (!query) return true;
  const lower = haystack.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => lower.includes(word));
}

function calendarLink(date: string | null): string {
  return date ? `${WORKSPACE_TASKS_CALENDAR_PATH}?date=${date}` : WORKSPACE_TASKS_CALENDAR_PATH;
}

function describeTask(task: Task) {
  return {
    title: task.title,
    status: task.status,
    priority: task.priority,
    due: task.due_date ? `${task.due_date}${task.due_time ? ` ${task.due_time}` : ""}` : null,
    link: calendarLink(task.due_date),
  };
}

const findProjects: Tool = async (userId, args) => {
  const query = text(args, "query");
  const projects = (await fetchProjects(userId)).filter(
    (project) => (!args.active_only || project.is_active) && matches(`${project.name} ${project.project_for_label}`, query),
  );
  return {
    projects: projects.slice(0, MAX_RESULTS).map((project) => ({
      name: project.name,
      client: project.project_for_label,
      active: project.is_active,
      link: buildProjectPath(project.id),
    })),
    total: projects.length,
  };
};

const findClients: Tool = async (userId, args) => {
  const query = text(args, "query");
  const clients = (await fetchClients(userId)).filter((client) => matches(`${client.company_name} ${client.client_name ?? ""}`, query));
  return {
    clients: clients.slice(0, MAX_RESULTS).map((client) => ({
      company: client.company_name,
      contact: client.client_name,
      email: client.email,
      active: client.is_active,
      link: buildClientPath(client.id),
    })),
    total: clients.length,
  };
};

const getTasks: Tool = async (userId, args) => {
  const status = text(args, "status");
  const from = text(args, "from");
  const to = text(args, "to");
  const query = text(args, "query");
  const tasks = (await fetchTasks(userId))
    .filter((task) => (status === "open" ? OPEN_STATUSES.has(task.status) : !status || task.status === status))
    .filter((task) => (!from || (task.due_date ?? "") >= from) && (!to || (task.due_date ?? "9999") <= to))
    .filter((task) => matches(task.title, query))
    .sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"));
  return { tasks: tasks.slice(0, MAX_RESULTS).map(describeTask), total: tasks.length };
};

const getSchedule: Tool = async (userId, args) => {
  const day = parseDateValue(text(args, "date")) ?? new Date();
  const date = serializeDateValue(day);
  const [tasks, reminders] = await Promise.all([fetchTasks(userId), fetchReminders(userId)]);
  const weekday = WEEKDAY_KEYS[day.getDay()];
  return {
    date,
    weekday: format(day, "EEEE"),
    calendar_link: calendarLink(date),
    tasks_due: tasks.filter((task) => task.due_date === date).map(describeTask),
    overdue_open_tasks: tasks.filter((task) => task.due_date && task.due_date < date && OPEN_STATUSES.has(task.status)).length,
    reminders: reminders
      .filter((reminder) => !reminder.is_disabled && reminder.days_of_week.includes(weekday))
      .map((reminder) => ({ title: reminder.title, time: reminder.reminder_time })),
    reminders_link: WORKSPACE_DAILY_REMINDERS_PATH,
  };
};

const getTodos: Tool = async (userId, args) => {
  const status = text(args, "status");
  const todos = (await fetchTodos(userId)).filter((todo) => !status || todo.status === status);
  return { todos: todos.slice(0, MAX_RESULTS).map((todo) => ({ title: todo.title, status: todo.status })), total: todos.length, link: "/workspace/dashboard" };
};

const searchNotes: Tool = async (userId, args) => {
  const query = text(args, "query");
  const [notes, projects] = await Promise.all([fetchNotes(userId), fetchProjects(userId)]);
  const projectNames = new Map(projects.map((project) => [project.id, project.name]));
  const found = notes
    .filter((note) => matches(`${note.title} ${note.body ?? ""}`, query))
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  return {
    notes: found.slice(0, MAX_RESULTS).map((note) => ({
      title: note.title,
      snippet: (note.body ?? "").slice(0, SNIPPET_LENGTH),
      project: note.project_id ? projectNames.get(note.project_id) : null,
      link: note.project_id ? buildProjectNotePath(note.project_id, note.id) : null,
    })),
    total: found.length,
  };
};

const TOOLS: Record<string, Tool> = {
  find_projects: findProjects,
  find_clients: findClients,
  get_tasks: getTasks,
  get_schedule: getSchedule,
  get_todos: getTodos,
  search_notes: searchNotes,
};

/** Never throws: a failure becomes an error the model can explain to the user. */
export async function runAssistantTool(userId: string, name: string, args: AssistantToolArgs = {}): Promise<AssistantToolResult> {
  const tool = TOOLS[name];
  if (!tool) return { error: `Unknown tool ${name}.` };
  try {
    return await tool(userId, args);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not load that data." };
  }
}
