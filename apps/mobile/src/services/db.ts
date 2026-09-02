export const DB = {
  REMINDERS: {
    TABLE: "reminders",
    SELECT:
      "id, user_id, title, description, reminder_time, days_of_week, is_disabled, disabled_until, status, category, created_at, updated_at",
  },
  REMINDER_OCCURRENCES: {
    TABLE: "reminder_occurrences",
    SELECT:
      "id, user_id, reminder_id, occurrence_date, status, reminders(category)",
  },
  EXPO_PUSH_TOKENS: {
    TABLE: "expo_push_tokens",
    SELECT: "id, user_id, token, last_used_at, created_at",
  },
} as const;
