import React from "react";
import { ScrollView, View } from "react-native";
import PageHeaderSkeleton from "../shared/PageHeaderSkeleton";
import StatsCardSkeleton from "../shared/StatsCardSkeleton";
import RemindersSectionSkeleton from "./RemindersSectionSkeleton";

const HomeScreenSkeleton: React.FC = () => {
  return (
    <>
      {/* Header Section - Fixed */}
      <View
        className="bg-background dark:bg-background-dark"
        style={{ paddingHorizontal: 24 }}
      >
        <PageHeaderSkeleton />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Card Skeleton */}
        <StatsCardSkeleton />

        {/* Reminders Section Skeleton */}
        <RemindersSectionSkeleton />

        {/* Reminders Guide Skeleton (Optional) */}
        <View className="mb-4">
          <View className="h-24 bg-muted dark:bg-muted-dark rounded-2xl animate-pulse" />
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreenSkeleton;
