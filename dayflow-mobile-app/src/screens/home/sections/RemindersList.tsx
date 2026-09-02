import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Reminder } from "@types";
import ReminderCard from "./ReminderCard";

interface Props {
  reminders: Reminder[];
  onReminderPress?: (reminder: Reminder) => void;
}

export default function RemindersList({ reminders, onReminderPress }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(300)}
      className="mb-1"
    >
      {reminders.map((reminder, index) => (
        <ReminderCard
          key={reminder.tempId || reminder.id}
          index={index}
          reminder={reminder}
          onPress={onReminderPress}
        />
      ))}
    </Animated.View>
  );
}
