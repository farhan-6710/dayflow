import { useState } from "react";
import * as Haptics from "expo-haptics";
import { DayOfWeek, Reminder, ReminderStatus, ReminderCategory } from "@types";
import { DAYS_OF_WEEK } from "@constants/reminders";
import { formatDisplayTime } from "@utils/home/reminderUtils";
import { statusForSchedule } from "@utils/reminderDay";

interface ReminderFormState {
  name: string;
  description: string;
  hour: string;
  minute: string;
  repeatDays: DayOfWeek[];
  category?: string;
  status?: string;
}

type ReminderFormValue = string | DayOfWeek[] | undefined;

type ReminderValue =
  | string
  | number
  | ReminderStatus
  | ReminderCategory
  | DayOfWeek[]
  | undefined;

/**
 * Hook for managing reminder form state and handlers
 * Consolidates all form logic in one place for cleaner components
 */
export const useReminderForm = (initialData?: Partial<Reminder>) => {
  const [formState, setFormState] = useState<ReminderFormState>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    hour: initialData?.hour?.toString() || "9",
    minute: initialData?.minute?.toString() || "0",
    repeatDays: initialData?.repeatDays || DAYS_OF_WEEK,
    category: initialData?.category,
    status: initialData?.status,
  });

  // Generic field change handler
  const handleFieldChange = (
    field: keyof ReminderFormState,
    value: ReminderFormValue
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimePickerChange = (hour: number, minute: number) => {
    setFormState((prev) => ({
      ...prev,
      hour: hour.toString(),
      minute: minute.toString(),
    }));
  };

  // Day toggle handler with haptic feedback
  const handleDayToggle = async (day: DayOfWeek) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setFormState((prev) => ({
      ...prev,
      repeatDays: prev.repeatDays.includes(day)
        ? prev.repeatDays.filter((d) => d !== day)
        : [...prev.repeatDays, day],
    }));
  };

  // Get numeric values for hour and minute
  const getNumericTime = () => ({
    hour: Math.max(0, Math.min(23, parseInt(formState.hour) || 0)),
    minute: Math.max(0, Math.min(59, parseInt(formState.minute) || 0)),
  });

  // Get complete form data ready for submission
  const getFormData = () => {
    const { hour, minute } = getNumericTime();
    return {
      ...formState,
      hour,
      minute,
      displayTime: formatDisplayTime(hour, minute),
    };
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormState({
      name: initialData?.name || "",
      description: initialData?.description || "",
      hour: initialData?.hour?.toString() || "9",
      minute: initialData?.minute?.toString() || "0",
      repeatDays: initialData?.repeatDays || DAYS_OF_WEEK,
      category: initialData?.category,
      status: initialData?.status,
    });
  };

  return {
    formState,
    handleFieldChange,
    handleTimePickerChange,
    handleDayToggle,
    getNumericTime,
    getFormData,
    resetForm,
  };
};

/**
 * Hook for managing reminder detail edits with change tracking
 * Extends the form hook with local changes tracking for edit scenarios
 */
export const useReminderEditForm = (reminder: Reminder | null) => {
  const [localChanges, setLocalChanges] = useState<Partial<Reminder>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Merge reminder with local changes for display
  const currentData = reminder ? { ...reminder, ...localChanges } : null;

  // Generic field change handler
  const handleFieldChange = (field: keyof Reminder, value: ReminderValue) => {
    if (!reminder) return;

    setLocalChanges((prev) => {
      const patch = { ...prev, [field]: value } as Partial<Reminder>;
      return {
        ...patch,
        status: statusForSchedule({ ...reminder, ...patch }),
      };
    });
    setHasChanges(true);
  };

  const handleTimePickerChange = (hour: number, minute: number) => {
    if (!reminder) return;

    setLocalChanges((prev) => {
      const patch = {
        ...prev,
        hour,
        minute,
        displayTime: formatDisplayTime(hour, minute),
      };
      return {
        ...patch,
        status: statusForSchedule({ ...reminder, ...patch }),
      };
    });
    setHasChanges(true);
  };

  // Day toggle handler with haptic feedback
  const handleDayToggle = async (day: DayOfWeek) => {
    if (!currentData) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const currentDays = currentData.repeatDays || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    handleFieldChange("repeatDays", updatedDays);
  };

  // Reset local changes
  const resetChanges = () => {
    setLocalChanges({});
    setHasChanges(false);
  };

  return {
    currentData,
    localChanges,
    hasChanges,
    setHasChanges,
    handleFieldChange,
    handleTimePickerChange,
    handleDayToggle,
    resetChanges,
  };
};
