import React from "react";
import { View } from "react-native";
import ReminderScheduleHeader from "@screens/home/sections/ReminderScheduleHeader";
import RemindersList from "@screens/home/sections/RemindersList";
import AddReminderButton from "@screens/home/buttons/AddReminderButton";
import { Reminder } from "@types";

interface RemindersSectionProps {
  /** Array of reminders to display */
  reminders: Reminder[];
  /** Callback when a reminder card is pressed */
  onReminderPress: (reminder: Reminder) => void;
  /** Callback when schedule header toggle is pressed */
  onToggleSchedule: () => void;
  /** Callback when add reminder button is pressed */
  onAddReminderPress: () => void;
}

const RemindersSection = React.memo<RemindersSectionProps>(
  ({ reminders, onReminderPress, onToggleSchedule, onAddReminderPress }) => {
    return (
      <View className="mt-2">
        {/* Reminders Header */}
        <ReminderScheduleHeader onToggle={onToggleSchedule} />

        {/* Reminders List */}
        <RemindersList
          reminders={reminders}
          onReminderPress={onReminderPress}
        />

        {/* Reminder Buttons */}
        <AddReminderButton onPress={onAddReminderPress} />
        {/* <ResetRemindersButton /> */}
      </View>
    );
  }
);

RemindersSection.displayName = "RemindersSection";

export default RemindersSection;
