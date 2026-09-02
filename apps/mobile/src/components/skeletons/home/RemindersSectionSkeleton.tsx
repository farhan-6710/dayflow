import React from "react";
import { View } from "react-native";

const ReminderCardSkeleton: React.FC = () => {
  return (
    <View className="bg-card dark:bg-card-dark rounded-2xl p-5 mb-3 border border-border dark:border-border-dark">
      <View className="flex-row items-center">
        {/* Icon Section */}
        <View className="relative">
          <View className="w-14 h-14 bg-muted dark:bg-muted-dark rounded-xl animate-pulse" />
          {/* Status Badge */}
          <View className="absolute -top-2 -right-2 w-6 h-6 bg-muted dark:bg-muted-dark rounded-full animate-pulse" />
        </View>

        {/* Content Section */}
        <View className="flex-1 ml-4">
          {/* Title */}
          <View className="h-5 w-28 bg-muted dark:bg-muted-dark rounded-md mb-2 animate-pulse" />
          {/* Time */}
          <View className="h-4 w-20 bg-muted dark:bg-muted-dark rounded-md animate-pulse" />
        </View>

        {/* Actions Section */}
        <View className="flex-row items-center gap-2">
          {/* Bell Button */}
          <View className="w-12 h-12 bg-muted dark:bg-muted-dark rounded-full animate-pulse" />
          {/* Arrow Button */}
          <View className="w-12 h-12 bg-muted dark:bg-muted-dark rounded-full animate-pulse" />
        </View>
      </View>
    </View>
  );
};

const RemindersSectionSkeleton: React.FC = () => {
  return (
    <View className="mt-2">
      {/* Schedule Header Skeleton */}
      <View className="mb-4">
        {/* Title */}
        <View className="h-4 w-48 bg-muted dark:bg-muted-dark rounded-md mb-3 animate-pulse" />

        {/* Time and Toggle Row */}
        <View className="flex-row items-center justify-between">
          {/* Current Time */}
          <View className="h-12 w-44 bg-muted dark:bg-muted-dark rounded-lg animate-pulse" />
          {/* Toggle Button */}
          <View className="w-16 h-8 bg-muted dark:bg-muted-dark rounded-full animate-pulse" />
        </View>
      </View>

      {/* Reminders List Skeleton - 4 cards */}
      <View className="mb-1">
        {[0, 1, 2, 3].map((index) => (
          <ReminderCardSkeleton key={index} />
        ))}
      </View>

      {/* Add Reminder Button Skeleton */}
      <View className="mb-4">
        <View className="h-14 bg-muted dark:bg-muted-dark rounded-2xl animate-pulse" />
      </View>

      {/* Reset Button Skeleton */}
      <View className="mb-4">
        <View className="h-14 bg-muted dark:bg-muted-dark rounded-2xl animate-pulse" />
      </View>
    </View>
  );
};

export default RemindersSectionSkeleton;
