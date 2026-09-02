import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";
import { remindersAPI } from "../api/remindersAPI";
import { scheduleLocalReminderNotifications } from "@services/localReminderScheduler";
import {
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
} from "../slices/remindersSlice";
import { Reminder } from "@types";

/**
 * Worker Saga: Fetch all reminders
 */
function* getRemindersWorker() {
  try {
    const reminders: Reminder[] = yield call(remindersAPI.getAll);
    yield put(getRemindersSuccess(reminders));
    yield call(scheduleLocalReminderNotifications, reminders);
  } catch (error) {
    console.error("[Redux Saga] Failed to fetch reminders:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch reminders";
    yield put(getRemindersFailure(errorMessage));
  }
}

/**
 * Worker Saga: Add a new reminder (Optimistic)
 * Toasts are here to guarantee delivery even if user navigates away
 */
function* addReminderWorker(
  action: PayloadAction<
    Omit<Reminder, "id" | "createdAt" | "updatedAt"> & { tempId: string }
  >
) {
  const { tempId, ...reminderData } = action.payload;

  try {
    const newReminder: Reminder = yield call(remindersAPI.create, reminderData);
    yield put(addReminderSuccess({ tempId, reminder: newReminder }));
    const reminders: Reminder[] = yield call(remindersAPI.getAll);
    yield call(scheduleLocalReminderNotifications, reminders);

    // Show success toast in saga (guaranteed delivery)
    Toast.show({
      type: "success",
      text1: "Reminder created",
      text2: "Your reminder has been added.",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to add reminder";
    yield put(addReminderFailure({ tempId, error: errorMessage }));

    // Show error toast in saga (guaranteed delivery)
    Toast.show({
      type: "error",
      text1: "Failed to add reminder",
      text2: errorMessage,
    });
  }
}

/**
 * Worker Saga: Update a reminder (Optimistic)
 * Toasts are here to guarantee delivery even if user navigates away
 */
function* updateReminderWorker(
  action: PayloadAction<{ id: string; updates: Partial<Reminder> }>
) {
  const { id, updates } = action.payload;
  try {
    const updatedReminder: Reminder = yield call(
      remindersAPI.update,
      id,
      updates
    );
    yield put(updateReminderSuccess(updatedReminder));
    const reminders: Reminder[] = yield call(remindersAPI.getAll);
    yield call(scheduleLocalReminderNotifications, reminders);

    // Show success toast in saga (guaranteed delivery)
    Toast.show({
      type: "success",
      text1: "Reminder updated",
      text2: "Your changes have been saved.",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update reminder";
    yield put(updateReminderFailure({ id, error: errorMessage }));

    // Show error toast in saga (guaranteed delivery)
    Toast.show({
      type: "error",
      text1: "Failed to update reminder",
      text2: errorMessage,
    });
  }
}

/**
 * Worker Saga: Delete a reminder (Optimistic)
 * Toasts are here to guarantee delivery even if user navigates away
 */
function* deleteReminderWorker(action: PayloadAction<string>) {
  const id = action.payload;
  try {
    yield call(remindersAPI.delete, id);
    yield put(deleteReminderSuccess(id));
    const reminders: Reminder[] = yield call(remindersAPI.getAll);
    yield call(scheduleLocalReminderNotifications, reminders);

    // Show success toast in saga (guaranteed delivery)
    Toast.show({
      type: "success",
      text1: "Reminder deleted",
      text2: "The reminder has been removed.",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete reminder";
    yield put(deleteReminderFailure({ id, error: errorMessage }));

    // Show error toast in saga (guaranteed delivery)
    Toast.show({
      type: "error",
      text1: "Failed to delete reminder",
      text2: errorMessage,
    });
  }
}

/**
 * Watcher Saga: Watch for reminder actions
 */
export function* remindersSaga() {
  yield takeLatest(getRemindersRequest.type, getRemindersWorker);
  yield takeEvery(addReminderRequest.type, addReminderWorker);
  yield takeLatest(updateReminderRequest.type, updateReminderWorker);
  yield takeEvery(deleteReminderRequest.type, deleteReminderWorker);
}
