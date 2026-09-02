import React from "react";
import { View } from "react-native";
import Text from "@components/atoms/Text";
import Button from "@components/atoms/Button";
import EditableField from "@components/molecules/EditableField";
import TimePickerField from "@components/molecules/TimePickerField";
import RepeatDaysSelector from "@components/molecules/RepeatDaysSelector";
import { useAddReminder } from "@hooks/reminders/useReminderCrud";
import { useReminderForm } from "@hooks/reminders/useReminderForm";
import { FormActions } from "@components/molecules";

interface AddReminderDrawerProps {
  /** Callback function to close the drawer */
  onClose: () => void;
}

export default function AddReminderDrawer({ onClose }: AddReminderDrawerProps) {
  const { handleAdd, isLoading } = useAddReminder();
  const {
    formState,
    handleFieldChange,
    handleTimePickerChange,
    handleDayToggle,
    getNumericTime,
  } = useReminderForm();

  const handleSave = async () => {
    // Early validation
    if (!formState.name.trim()) return;

    const { hour, minute } = getNumericTime();

    await handleAdd(
      {
        name: formState.name,
        description: formState.description,
        hour,
        minute,
        repeatDays: formState.repeatDays,
      },
      onClose
    );
  };

  const isFormValid = formState.name.trim().length > 0;

  return (
    <View
      className="bg-background dark:bg-background-dark px-6 pt-6 pb-8 rounded-t-2xl"
      style={{ zIndex: 100 }}
    >
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Add Reminder
      </Text>

      {/* Name Field */}
      <EditableField
        icon="notifications-outline"
        label="Name"
        value={formState.name}
        onChange={(value) => handleFieldChange("name", value)}
        placeholder="Reminder name"
      />

      {/* Description Field */}
      <EditableField
        icon="document-text-outline"
        label="Description"
        value={formState.description}
        onChange={(value) => handleFieldChange("description", value)}
        placeholder="Reminder description"
      />

      {/* Time Picker */}
      <TimePickerField
        hour={formState.hour}
        minute={formState.minute}
        onChange={handleTimePickerChange}
      />

      {/* Repeat Days */}
      <RepeatDaysSelector
        selectedDays={formState.repeatDays}
        onDayToggle={handleDayToggle}
      />

      {/* Action Buttons */}
      <FormActions>
        <Button
          onPress={onClose}
          title="Cancel"
          variant="secondary"
          size="medium"
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onPress={handleSave}
          title="Save"
          variant="primary"
          size="medium"
          disabled={!isFormValid || isLoading}
          loading={isLoading}
          className="flex-1"
        />
      </FormActions>
    </View>
  );
}
