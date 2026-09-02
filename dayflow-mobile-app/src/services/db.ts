export const DB = {
  REMINDERS: {
    TABLE: "reminders",
    SELECT:
      "id, user_id, title, description, reminder_time, days_of_week, is_disabled, disabled_until, status, category, created_at, updated_at",
  },
  EXPO_PUSH_TOKENS: {
    TABLE: "expo_push_tokens",
    SELECT: "id, user_id, token, last_used_at, created_at",
  },
} as const;
