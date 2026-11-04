import type { NoteCategory } from "@/shared/constants/noteCategories";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  owner_user_id: string;
  company_name: string;
  client_name: string | null;
  mobile_number: string | null;
  email: string | null;
  secondary_contact_name: string | null;
  secondary_contact_number: string | null;
  website_url: string | null;
  is_active: boolean;
  auth_user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  color_hex: string;
  is_active: boolean;
  project_for: string | null;
  project_for_label: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  body: string | null;
  category: NoteCategory;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ReferenceLink = {
  id: string;
  user_id: string;
  url: string;
  label: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectReferenceLink = ReferenceLink & { project_id: string };
export type NoteReferenceLink = ReferenceLink & { note_id: string };

export type CreateReferenceLinkInput = {
  url: string;
  label?: string | null;
};
export type CreateProjectReferenceLinkInput = CreateReferenceLinkInput;
export type CreateNoteReferenceLinkInput = CreateReferenceLinkInput;

export type TaskStatus = "todo" | "in_progress" | "done" | "missed";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  due_time: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ReminderDayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type Reminder = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  reminder_time: string;
  days_of_week: ReminderDayKey[];
  is_disabled: boolean;
  disabled_until: string | null;
  created_at: string;
  updated_at: string;
};

export type NotificationType = "reminder" | "task";

export type AppNotification = {
  id: string;
  user_id: string;
  notification_type: NotificationType;
  title: string;
  message: string;
  status: "unread" | "read";
  related_id: string | null;
  created_at: string;
  read_at: string | null;
};

export type TodoStatus = "pending" | "completed";

export type Todo = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
