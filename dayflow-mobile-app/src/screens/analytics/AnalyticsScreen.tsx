import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Menu } from "lucide-react-native";
import { useThemeColors } from "@constants/theme";
import { useDrawer } from "@/providers/DrawerProvider";
import { useAnalyticsData } from "@hooks/analytics/useAnalyticsData";
import PageHeader from "@components/organisms/PageHeader";
import StatsOverviewCard from "@components/organisms/StatsOverviewCard";
import WeeklyTrendCard from "@screens/analytics/WeeklyTrendCard";
import CategoryBreakdownCard from "@screens/analytics/CategoryBreakdownCard";
import BestStreakCard from "@screens/analytics/BestStreakCard";

export default function AnalyticsScreen() {
  const colors = useThemeColors();
  const { openDrawer } = useDrawer();
  const { stats, weekData, categories, streakData } = useAnalyticsData();

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <PageHeader
        icon="analytics"
        title="Analytics"
        subtitle="Track your performance insights"
        animationDelay={100}
        actionButton={
          <TouchableOpacity
            className="w-12 h-12 rounded-xl justify-center items-center border border-border dark:border-border-dark bg-card dark:bg-card-dark"
            onPress={openDrawer}
            activeOpacity={0.7}
          >
            <Menu size={24} color={colors.heading} strokeWidth={2} />
          </TouchableOpacity>
        }
      />

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 70,
          paddingTop: 20,
          paddingHorizontal: 24,
        }}
      >
        <StatsOverviewCard stats={stats} animationDelay={150} />

        <BestStreakCard
          currentStreak={streakData.currentStreak}
          bestStreak={streakData.bestStreak}
          animationDelay={200}
        />

        <WeeklyTrendCard weekData={weekData} animationDelay={250} />

        <CategoryBreakdownCard categories={categories} animationDelay={300} />
      </ScrollView>
    </View>
  );
}
