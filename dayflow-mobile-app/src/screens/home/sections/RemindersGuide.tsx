import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@components/atoms/Text";

export default function RemindersGuide() {
  if (!__DEV__) return null; // Only show in development mode

  return (
    <View className="bg-card dark:bg-green-900/20 border border-green-400 dark:border-green-800 rounded-xl p-5 mb-4">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Ionicons
          name="information-circle"
          size={24}
          className="text-green-600 dark:text-green-400 mr-2"
          color="#16a34a"
        />
        <Text className="text-lg font-semibold font-serif text-green-800 dark:text-green-300">
          How Reminders Work
        </Text>
      </View>

      {/* Guide Content */}
      <View className="space-y-3">
        {/* Creating Reminders */}
        <Text
          className="text-sm text-green-700 dark:text-green-200 leading-6 font-serif mb-3"
          numberOfLines={0}
        >
          <Text className="font-semibold font-serif">
            Creating Reminders :-{" "}
          </Text>
          Tap the "+" button to add a new reminder. Set a name, time, and select
          which days it should repeat. Once saved, you'll receive a notification
          with a catchy sound at the scheduled time to remind you of your task.
        </Text>

        {/* Reminder States */}
        <Text
          className="text-sm text-green-700 dark:text-green-200 leading-6 font-serif mb-3"
          numberOfLines={0}
        >
          <Text className="font-semibold font-serif">Reminder States :- </Text>
          New reminders are marked as{" "}
          <Text className="font-semibold font-serif">Upcoming</Text> if the time
          is in the future, or{" "}
          <Text className="font-semibold font-serif">Missed</Text> if the time
          has passed. When you complete a task, tap the reminder to open details
          and change its status to{" "}
          <Text className="font-semibold font-serif">Done</Text>. You can switch
          between Done and Missed anytime.
        </Text>

        {/* Managing Reminders */}
        <Text
          className="text-sm text-green-700 dark:text-green-200 leading-6 font-serif mb-3"
          numberOfLines={0}
        >
          <Text className="font-semibold font-serif">
            Managing Reminders :-{" "}
          </Text>
          Tap any reminder to view and edit its details - change the time,
          description, repeat days, or status. You can also disable a reminder
          temporarily without deleting it, or remove it permanently using the
          delete button at the bottom of the details screen.
        </Text>
      </View>

      {/* Footer Note */}
      <View className="mt-4 pt-3 border-t border-green-200 dark:border-green-700">
        <Text className="text-xs text-green-600 dark:text-green-400">
          💡 This guide is only visible in development mode
        </Text>
      </View>
    </View>
  );
}
