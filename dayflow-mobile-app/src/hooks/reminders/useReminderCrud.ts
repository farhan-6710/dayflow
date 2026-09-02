import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@redux/store";
import {
  addReminderRequest,
  updateReminderRequest,
  deleteReminderRequest,
} from "@redux/slices/remindersSlice";
import { useAuth } from "@providers/AuthProvider";
import { Reminder, DayOfWeek, ReminderStatus, ReminderCategory } from "@types";
import { formatDisplayTime } from "@utils/home/reminderUtils";
import { initialReminderStatus } from "@utils/reminderDay";

interface AddReminderData {
  name: string;
  description: string;
  hour: number;
  minute: number;
  repeatDays: DayOfWeek[];
}

/**
 * Hook for adding a new reminder (Optimistic UI)
 * Closes drawer immediately after dispatch - rollback handles failures
 */
export const useAddReminder = () => {
  const { session } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const reminders = useSelector(
    (state: RootState) => state.reminders.reminders
  );

  const handleAdd = async (data: AddReminderData, onSuccess?: () => void) => {
    if (!session) {
      Toast.show({
        type: "error",
        text1: "Authentication required",
        text2: "Please log in to add reminders.",
      });
      return false;
    }

    // Persist missed immediately if today's scheduled time already passed
    const status: ReminderStatus = initialReminderStatus({
      hour: data.hour,
      minute: data.minute,
      repeatDays: data.repeatDays,
    });

    const reminderData = {
      name: data.name,
      description: data.description,
      hour: data.hour,
      minute: data.minute,
      displayTime: formatDisplayTime(data.hour, data.minute),
      status,
      category: "personal" as ReminderCategory,
      repeatDays: data.repeatDays,
      tempId: `temp_${Date.now()}`,
    };

    // Add reminder directly (no past time check needed)
    dispatch(addReminderRequest(reminderData));

    onSuccess?.();
    return true;
  };

  // Check if any reminder is currently being saved
  const isLoading = reminders.some((r) => r.syncState === "saving");

  return { handleAdd, isLoading };
};

/**
 * Hook for updating a reminder (Optimistic UI)
 * Navigates immediately after dispatch - rollback handles failures
 */
export const useUpdateReminder = (reminderId?: string) => {
  const { session } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const reminders = useSelector(
    (state: RootState) => state.reminders.reminders
  );

  const handleUpdate = async (id: string, updates: Partial<Reminder>) => {
    if (!session) {
      Toast.show({
        type: "error",
        text1: "Authentication required",
        text2: "Please log in to update reminders.",
      });
      return false;
    }

    // Dispatch update and navigate immediately (optimistic UI)
    dispatch(updateReminderRequest({ id, updates }));
    router.back();
    return true;
  };

  // Check if the specific reminder is being updated
  const isLoading = reminderId
    ? reminders.find((r) => r.id === reminderId)?.syncState === "saving"
    : false;

  return { handleUpdate, isLoading };
};

/**
 * Hook for deleting a reminder (Optimistic UI)
 * Navigates immediately after dispatch - rollback handles failures
 */
export const useDeleteReminder = (reminderId?: string) => {
  const { session } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const reminders = useSelector(
    (state: RootState) => state.reminders.reminders
  );

  const handleDelete = async (reminder: { id: string; name: string }) => {
    if (!session) {
      Toast.show({
        type: "error",
        text1: "Authentication required",
        text2: "Please log in to delete reminders.",
      });
      return false;
    }

    return new Promise<boolean>((resolve) => {
      Alert.alert(
        "Delete Reminder",
        `Are you sure you want to delete "${reminder.name}"? This action cannot be undone.`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              // Dispatch delete and navigate immediately (optimistic UI)
              dispatch(deleteReminderRequest(reminder.id));
              router.replace("/(tabs)");
              resolve(true);
            },
          },
        ]
      );
    });
  };

  // Check if the specific reminder is being deleted
  const isLoading = reminderId
    ? reminders.find((r) => r.id === reminderId)?.syncState === "deleting"
    : false;

  return { handleDelete, isLoading };
};
