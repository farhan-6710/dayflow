import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reminder, ReminderStatus } from "@types";

// Helper functions
const isUpcoming = (status: ReminderStatus) => status === "upcoming";
const isPaused = (status: ReminderStatus) => status === "paused";

interface RemindersState {
  reminders: Reminder[];
  globalPaused: boolean;
  getRemindersLoading: boolean; // For initial fetch only
  pendingUpdates: Record<string, Reminder>; // Rollback snapshots for updates
  lastDeletedReminder: Reminder | null; // Rollback snapshot for deletes
}

const initialState: RemindersState = {
  reminders: [],
  globalPaused: false,
  getRemindersLoading: false,
  pendingUpdates: {},
  lastDeletedReminder: null,
};

const remindersSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {
    // GET Reminders
    getRemindersRequest: (state) => {
      state.getRemindersLoading = true;
    },
    getRemindersSuccess: (state, action: PayloadAction<Reminder[]>) => {
      state.getRemindersLoading = false;
      state.reminders = Array.isArray(action.payload) ? action.payload : [];
    },
    getRemindersFailure: (state, _action: PayloadAction<string>) => {
      state.getRemindersLoading = false;
    },

    // ADD Reminder (Optimistic)
    addReminderRequest: (
      state,
      action: PayloadAction<
        Omit<Reminder, "id" | "createdAt" | "updatedAt"> & { tempId: string }
      >
    ) => {
      const { tempId } = action.payload;
      const optimisticReminder: Reminder = {
        ...action.payload,
        id: tempId,
        tempId,
        syncState: "saving",
      };
      // Insert immediately (optimistic)
      state.reminders = [...state.reminders, optimisticReminder];
    },
    addReminderSuccess: (
      state,
      action: PayloadAction<{ tempId: string; reminder: Reminder }>
    ) => {
      // Replace temp reminder with real one from server, but keep tempId for stable React key
      state.reminders = state.reminders.map((r) =>
        r.tempId === action.payload.tempId
          ? {
              ...action.payload.reminder,
              tempId: action.payload.tempId,
              syncState: "synced",
            }
          : r
      );
    },
    addReminderFailure: (
      state,
      action: PayloadAction<{ tempId: string; error: string }>
    ) => {
      // Remove failed reminder (rollback optimistic add)
      state.reminders = state.reminders.filter(
        (r) => r.tempId !== action.payload.tempId
      );
    },

    // UPDATE Reminder (Optimistic)
    updateReminderRequest: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Reminder> }>
    ) => {
      const { id, updates } = action.payload;
      const existing = state.reminders.find((r) => r.id === id);
      if (!existing) return;

      // Save snapshot for rollback
      state.pendingUpdates[id] = { ...existing };

      // Apply update immediately (optimistic)
      state.reminders = state.reminders.map((r) =>
        r.id === id ? { ...r, ...updates, syncState: "saving" } : r
      );
    },
    updateReminderSuccess: (state, action: PayloadAction<Reminder>) => {
      // Clear snapshot, set synced
      delete state.pendingUpdates[action.payload.id];
      state.reminders = state.reminders.map((r) =>
        r.id === action.payload.id
          ? { ...action.payload, syncState: "synced" }
          : r
      );
    },
    updateReminderFailure: (
      state,
      action: PayloadAction<{ id: string; error: string }>
    ) => {
      const { id } = action.payload;
      const snapshot = state.pendingUpdates[id];
      if (snapshot) {
        // Rollback to snapshot
        state.reminders = state.reminders.map((r) =>
          r.id === id ? { ...snapshot, syncState: "failed" } : r
        );
        delete state.pendingUpdates[id];
      }
    },

    // DELETE Reminder (Optimistic)
    deleteReminderRequest: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const toDelete = state.reminders.find((r) => r.id === id);
      if (!toDelete) return;

      // Save snapshot for rollback
      state.lastDeletedReminder = { ...toDelete };

      // Remove immediately (optimistic)
      state.reminders = state.reminders.filter((r) => r.id !== id);
    },
    deleteReminderSuccess: (state, _action: PayloadAction<string>) => {
      // Clear snapshot
      state.lastDeletedReminder = null;
    },
    deleteReminderFailure: (
      state,
      _action: PayloadAction<{ id: string; error: string }>
    ) => {
      // Restore from snapshot
      if (state.lastDeletedReminder) {
        state.reminders = [
          ...state.reminders,
          { ...state.lastDeletedReminder, syncState: "failed" },
        ];
        state.lastDeletedReminder = null;
      }
    },

    // Set Reminders (for logged out users)
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = Array.isArray(action.payload) ? action.payload : [];
    },

    // Bulk Operations
    pauseAllReminders: (state) => {
      state.reminders = state.reminders.map((reminder) => ({
        ...reminder,
        status: isUpcoming(reminder.status) ? "paused" : reminder.status,
      }));
      state.globalPaused = true;
    },

    resumeAllReminders: (state) => {
      state.reminders = state.reminders.map((reminder) => ({
        ...reminder,
        status: isPaused(reminder.status) ? "upcoming" : reminder.status,
      }));
      state.globalPaused = false;
    },

    toggleGlobalPause: (state) => {
      if (state.globalPaused) {
        state.reminders = state.reminders.map((reminder) => ({
          ...reminder,
          status: isPaused(reminder.status) ? "upcoming" : reminder.status,
        }));
        state.globalPaused = false;
      } else {
        state.reminders = state.reminders.map((reminder) => ({
          ...reminder,
          status: isUpcoming(reminder.status) ? "paused" : reminder.status,
        }));
        state.globalPaused = true;
      }
    },

    // Reset
    resetReminders: (state) => {
      state.reminders = [];
      state.globalPaused = false;
    },
  },
});

export const {
  getRemindersRequest,
  getRemindersSuccess,
  getRemindersFailure,
  addReminderRequest,
  addReminderSuccess,
  addReminderFailure,
  updateReminderRequest,
  updateReminderSuccess,
  updateReminderFailure,
  deleteReminderRequest,
  deleteReminderSuccess,
  deleteReminderFailure,
  setReminders,
  pauseAllReminders,
  resumeAllReminders,
  toggleGlobalPause,
  resetReminders,
} = remindersSlice.actions;

export default remindersSlice.reducer;
