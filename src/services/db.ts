// Database Table & Select Field constants for DayFlow.
// All services import from here instead of using inline string names.

export const DB = {
  PROFILES: {
    TABLE: "profiles",
    SELECT: "id, display_name, avatar_url, theme_preference, created_at, updated_at",
  },
  PROJECTS: {
    TABLE: "projects",
    SELECT:
      "id, user_id, name, color_hex, is_archived, project_for, created_at, updated_at, project_for_client:clients!project_for(client_name)",
  },
  CLIENTS: {
    TABLE: "clients",
    SELECT:
      "id, user_id, client_name, email, primary_contact_name, mobile_number, secondary_contact_name, secondary_mobile_number, website_name, is_active, created_at, updated_at",
  },
  TASKS: {
    TABLE: "tasks",
    SELECT: "id, user_id, title, description, status, priority, due_date, due_time, created_at, updated_at",
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
    SELECT: "id, user_id, title, description, reminder_time, days_of_week, is_disabled, disabled_until, created_at, updated_at",
  },
  NOTIFICATIONS: {
    TABLE: "notifications",
    SELECT: "id, user_id, notification_type, title, message, status, related_id, created_at, read_at",
  },
} as const;
