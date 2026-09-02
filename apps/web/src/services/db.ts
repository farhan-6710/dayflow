// Database Table & Select Field constants for DayFlow.
// All services import from here instead of using inline string names.

export const DB = {
  PROFILES: {
    TABLE: "profiles",
    SELECT:
      "id, display_name, avatar_url, theme_preference, created_at, updated_at",
  },
  PROJECTS: {
    TABLE: "projects",
    SELECT:
      "id, user_id, name, color_hex, is_archived, project_for, created_at, updated_at, project_for_client:clients!project_for(company_name)",
  },
  CLIENTS: {
    TABLE: "clients",
    SELECT:
      "id, owner_user_id, company_name, client_name, mobile_number, email, secondary_contact_name, secondary_contact_number, website_url, is_active, auth_user_id, created_at, updated_at",
  },
  CLIENT_CONVERSATION_MESSAGES: {
    TABLE: "client_conversation_messages",
    SELECT:
      "id, client_id, author_user_id, author_client_id, body, created_at, updated_at, author_user:profiles!author_user_id(display_name), author_client:clients!author_client_id(company_name, client_name)",
  },
  TASKS: {
    TABLE: "tasks",
    SELECT:
      "id, user_id, title, description, status, priority, due_date, due_time, created_at, updated_at",
  },
  NOTES: {
    TABLE: "notes",
    SELECT: "id, user_id, project_id, title, body, created_at, updated_at",
  },
  PROJECT_REFERENCE_LINKS: {
    TABLE: "project_reference_links",
    SELECT: "id, project_id, user_id, url, label, created_at, updated_at",
  },
  REMINDERS: {
    TABLE: "reminders",
    SELECT:
      "id, user_id, title, description, reminder_time, days_of_week, is_disabled, disabled_until, status, category, created_at, updated_at",
  },
  REMINDER_OCCURRENCES: {
    TABLE: "reminder_occurrences",
    SELECT: "id, user_id, reminder_id, occurrence_date, status",
  },
  NOTIFICATIONS: {
    TABLE: "notifications",
    SELECT:
      "id, user_id, notification_type, title, message, status, related_id, created_at, read_at",
  },
  CLIENT_ACTIVITY_TASKS: {
    TABLE: "client_activity_tasks",
    SELECT:
      "id, project_id, title, description, priority, status, eta_date, eta_time, raised_by, created_at, updated_at",
  },
  CLIENT_ACTIVITY_MEETINGS: {
    TABLE: "client_activity_meetings",
    SELECT:
      "id, project_id, title, description, status, from_date, from_time, to_date, to_time, venue, raised_by, created_at, updated_at",
  },
  CLIENT_ACTIVITY_CALLS: {
    TABLE: "client_activity_calls",
    SELECT:
      "id, project_id, title, description, status, start_date, start_time, duration_minutes, raised_by, created_at, updated_at",
  },
} as const;
