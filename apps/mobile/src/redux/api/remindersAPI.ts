import {
  createReminder,
  deleteReminder,
  fetchReminders,
  updateReminder,
} from "@services/remindersService";
import { Reminder } from "@types";

export const remindersAPI = {
  async getAll(): Promise<Reminder[]> {
    return fetchReminders();
  },

  async create(
    reminder: Omit<Reminder, "id" | "createdAt" | "updatedAt">,
  ): Promise<Reminder> {
    return createReminder(reminder);
  },

  async update(id: string, updates: Partial<Reminder>): Promise<Reminder> {
    return updateReminder(id, updates);
  },

  async delete(id: string): Promise<void> {
    return deleteReminder(id);
  },
};
