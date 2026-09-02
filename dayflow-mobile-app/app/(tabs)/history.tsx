import React, { useState, useRef } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import Text from "@components/atoms/Text";
import ReminderHistoryCard from "@screens/history/ReminderHistoryCard";
import { ReminderHistoryItem, StatItem } from "@types";
import { useThemeColors } from "@constants/theme";
import PageHeader from "@components/organisms/PageHeader";
import StatsOverviewCard from "@components/organisms/StatsOverviewCard";
import { Menu } from "lucide-react-native";
import { useDrawer } from "@/providers/DrawerProvider";
import { REMINDERS_HISTORY } from "@/constants";

/**
 * History Screen
 *
 * Main section component for displaying reminder history.
 * Shows a header with statistics and a paginated list of daily reminder cards.
 */
const HistoryScreen = React.memo(() => {
  const colors = useThemeColors();
  const { openDrawer } = useDrawer();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination calculations
  const totalPages = Math.ceil(REMINDERS_HISTORY.length / itemsPerPage);
  const currentItems = REMINDERS_HISTORY.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };
  const handleItemPress = (_item: ReminderHistoryItem) => {
    // Functionality to be added later
  };

  // Calculate overall stats
  const totalDays = REMINDERS_HISTORY.length;
  const totalCompleted = REMINDERS_HISTORY.reduce(
    (sum, item) => sum + item.remindersChecked,
    0
  );
  const totalReminders = REMINDERS_HISTORY.reduce(
    (sum, item) => sum + item.totalReminders,
    0
  );
  const overallPercentage =
    totalReminders > 0
      ? Math.round((totalCompleted / totalReminders) * 100)
      : 0;

  // Prepare stats data for StatsOverviewCard
  const stats: StatItem[] = [
    {
      icon: "calendar",
      iconColor: colors.primary,
      iconBgClass: "bg-blue-100 dark:bg-blue-900/30",
      label: "Days",
      value: totalDays,
    },
    {
      icon: "checkmark-circle",
      iconColor:
        overallPercentage >= 80
          ? colors.success
          : overallPercentage >= 50
          ? colors.warning
          : colors.error,
      iconBgClass:
        overallPercentage >= 80
          ? "bg-green-100 dark:bg-green-900/30"
          : overallPercentage >= 50
          ? "bg-amber-100 dark:bg-amber-900/30"
          : "bg-red-100 dark:bg-red-900/30",
      label: "Rate",
      value: `${overallPercentage}%`,
    },
    {
      icon: "checkmark-done",
      iconColor: colors.success,
      iconBgClass: "bg-teal-100 dark:bg-teal-900/30",
      label: "Done",
      value: totalCompleted,
    },
  ];

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <PageHeader
        icon="stats-chart"
        title="History"
        subtitle="Track your daily progress"
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
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
        }}
      >
        {/* Content with horizontal padding */}
        <View style={{ paddingHorizontal: 24 }}>
          <Animated.View entering={FadeInUp.duration(300).delay(150)}>
            {/* Stats Overview Card */}
            {totalDays > 0 && (
              <StatsOverviewCard stats={stats} animationDelay={0} />
            )}

            {/* Section Title */}
            <View className="flex-row items-center justify-between">
              <Text className="text-md font-semibold text-foreground dark:text-foreground-dark mb-3 mt-4 uppercase tracking-wide">
                Daily Records
              </Text>
              <Text className="text-xs font-bold text-muted-foreground dark:text-muted-foreground-dark uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </Text>
            </View>

            {/* History List */}
            <View>
              {currentItems.map((item, index) => (
                <ReminderHistoryCard
                  key={item.id}
                  item={item}
                  index={index}
                  onPress={handleItemPress}
                />
              ))}
            </View>
          </Animated.View>
        </View>

        {/* Pagination Bar - Full Width */}
        <View className="mt-4 mb-24 px-6 py-4 border border-border dark:border-border-dark bg-card dark:bg-card-dark">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`h-12 w-12 items-center justify-center rounded-xl ${
                currentPage === 1
                  ? "opacity-20 bg-muted dark:bg-muted-dark"
                  : "bg-primary"
              }`}
            >
              <Text className="text-foreground dark:text-foreground-dark font-bold text-lg">
                ←
              </Text>
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-xs font-bold text-muted-foreground dark:text-muted-foreground-dark uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`h-12 w-12 items-center justify-center rounded-xl ${
                currentPage === totalPages
                  ? "opacity-20 bg-muted dark:bg-muted-dark"
                  : "bg-primary"
              }`}
            >
              <Text className="text-white font-bold text-lg">→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

HistoryScreen.displayName = "HistoryScreen";

export default HistoryScreen;
