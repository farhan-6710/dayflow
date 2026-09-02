import type { ApiResult } from "@api/client";
import { ErrorType } from "@api/errors/types";
import {
  createReminder,
  deleteReminder,
  fetchReminders,
  updateReminder,
} from "@services/remindersService";
import type { Reminder } from "@types";

interface ReminderResponse {
  data: Reminder | Reminder[];
  message?: string;
}

function unwrap<T>(result: ApiResult<T>): T {
  if (result.error) {
    throw new Error(result.error.message);
  }

  if (result.data === null || result.data === undefined) {
    throw new Error("No data returned from Supabase");
  }

  return result.data;
}

export const reminderAPI = {
  getAll: async (): Promise<ApiResult<ReminderResponse>> => {
    try {
      const reminders = await fetchReminders();
      return { data: { data: reminders }, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          type: ErrorType.UNKNOWN,
          message: error instanceof Error ? error.message : "Failed to fetch reminders",
        },
      };
    }
  },

  add: async (
    payload:
      | Omit<Reminder, "id" | "createdAt" | "updatedAt">
      | Omit<Reminder, "id" | "createdAt" | "updatedAt">[],
  ): Promise<ApiResult<ReminderResponse>> => {
    try {
      const items = Array.isArray(payload) ? payload : [payload];
      const created = await Promise.all(items.map((item) => createReminder(item)));
      const data = created.length === 1 ? created[0]! : created;
      return { data: { data }, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          type: ErrorType.UNKNOWN,
          message: error instanceof Error ? error.message : "Failed to add reminder",
        },
      };
    }
  },

  update: async (
    reminderId: string,
    payload: Partial<Reminder>,
  ): Promise<ApiResult<ReminderResponse>> => {
    try {
      const updated = await updateReminder(reminderId, payload);
      return { data: { data: updated }, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          type: ErrorType.UNKNOWN,
          message: error instanceof Error ? error.message : "Failed to update reminder",
        },
      };
    }
  },

  delete: async (reminderId: string): Promise<ApiResult<void>> => {
    try {
      await deleteReminder(reminderId);
      return { data: undefined, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          type: ErrorType.UNKNOWN,
          message: error instanceof Error ? error.message : "Failed to delete reminder",
        },
      };
    }
  },

  /** Throws on failure — for notification action handlers. */
  async updateOrThrow(reminderId: string, payload: Partial<Reminder>): Promise<Reminder> {
    const result = await this.update(reminderId, payload);
    const response = unwrap(result);
    return Array.isArray(response.data) ? response.data[0]! : response.data;
  },
};
