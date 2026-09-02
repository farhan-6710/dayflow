import React, { useEffect, useCallback } from "react";
import { ScrollView } from "react-native";
import { Reminder, ReminderCategory } from "@types";
import { getTimeUntilReminder } from "@utils/home/utils";
import { router } from "expo-router";
import EditableField from "@components/molecules/EditableField";
import ReadOnlyField from "@components/atoms/ReadOnlyField";
import EmptyState from "@components/atoms/EmptyState";
import TimePickerField from "@components/molecules/TimePickerField";
import RepeatDaysSelector from "@components/molecules/RepeatDaysSelector";
import StatusSelector from "./StatusSelector";
import CategorySelector from "./CategorySelector";
import EnabledToggle from "./EnabledToggle";
import DeleteReminderButton from "./buttons/DeleteReminderButton";
import SaveDetailsButton from "./buttons/SaveDetailsButton";
import { useReminderEditForm } from "@/hooks";

interface ReminderDetailsProps {
  /** The reminder to edit, or null if none selected */
  reminder: Reminder | null;
  /** Update handler from parent screen */
  onUpdate: (id: string, updates: Partial<Reminder>) => Promise<boolean>;
  /** Delete handler from parent screen */
  onDelete: (reminder: { id: string; name: string }) => Promise<boolean>;
  /** Loading state for update operation */
  isUpdating: boolean;
  /** Loading state for delete operation */
  isDeleting: boolean;
}

const ReminderDetails = React.memo<ReminderDetailsProps>(
  ({ reminder, onUpdate, onDelete, isUpdating, isDeleting }) => {
    const {
      currentData,
      localChanges,
      hasChanges,
      handleFieldChange,
      handleTimePickerChange,
      handleDayToggle,
      resetChanges,
    } = useReminderEditForm(reminder);

    // Reset local changes when reminder changes
    useEffect(() => {
      resetChanges();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reminder?.id]);

    // Save details handler (memoized to prevent unnecessary re-renders)
    const handleSaveDetails = useCallback(async () => {
      if (hasChanges && Object.keys(localChanges).length > 0) {
        const success = await onUpdate(reminder?.id ?? "", localChanges);
        if (success) {
          resetChanges();
        }
      } else {
        router.back();
      }
    }, [hasChanges, localChanges, reminder?.id, onUpdate, resetChanges]);

    // Early return if no reminder data
    if (!reminder || !currentData) {
      return <EmptyState />;
    }

    const selectedCategory: ReminderCategory =
      currentData.category ?? "personal";

    const handleDeleteDetails = async () => {
      if (!reminder) return;
      await onDelete({ id: reminder.id, name: reminder.name });
    };

    return (
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark p-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <EditableField
          icon="notifications-outline"
          label="Title"
          value={currentData.name}
          onChange={(value) => handleFieldChange("name", value)}
          placeholder="Reminder name"
        />

        {/* Description */}
        <EditableField
          icon="document-text-outline"
          label="Description"
          value={currentData.description || ""}
          onChange={(value) => handleFieldChange("description", value)}
          placeholder="Add a description"
          multiline
        />

        {/* Category Selector */}
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelect={(category) => handleFieldChange("category", category)}
        />

        {/* Status - Only show for completed states (done/missed) */}
        {(currentData.status === "done" || currentData.status === "missed") && (
          <StatusSelector
            currentStatus={currentData.status}
            onStatusChange={(status) => handleFieldChange("status", status)}
          />
        )}

        {/* Time Picker */}
        <TimePickerField
          hour={currentData.hour}
          minute={currentData.minute}
          onChange={handleTimePickerChange}
        />

        {/* Time Remaining */}
        <ReadOnlyField
          icon="hourglass-outline"
          label="Time Until Reminder"
          value={getTimeUntilReminder(currentData.hour, currentData.minute)}
          colorScheme="green"
        />

        {/* Repeat Days */}
        <RepeatDaysSelector
          selectedDays={currentData.repeatDays || []}
          onDayToggle={handleDayToggle}
        />

        {/* Enabled Toggle */}
        <EnabledToggle
          status={currentData.status}
          onToggle={(newStatus) => handleFieldChange("status", newStatus)}
        />

        {/* Save Details Button */}
        <SaveDetailsButton
          onSave={handleSaveDetails}
          disabled={!hasChanges || isUpdating}
          loading={isUpdating}
        />

        {/* Delete Button */}
        <DeleteReminderButton
          onDelete={handleDeleteDetails}
          loading={isDeleting}
        />
      </ScrollView>
    );
  }
);

ReminderDetails.displayName = "ReminderDetails";

export default ReminderDetails;
