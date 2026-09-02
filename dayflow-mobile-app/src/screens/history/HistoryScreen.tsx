import React, { useState, useRef } from "react";
import { ScrollView, TouchableOpacity, View, ActivityIndicator } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import Text from "@components/atoms/Text";
import ReminderHistoryCard from "@screens/history/ReminderHistoryCard";
import { ReminderHistoryItem, StatItem } from "@types";
import { useThemeColors } from "@constants/theme";
import PageHeader from "@components/organisms/PageHeader";
import StatsOverviewCard from "@components/organisms/StatsOverviewCard";
import { Menu } from "lucide-react-native";
import { useDrawer } from "@/providers/DrawerProvider";
import { useReminderHistory } from "@hooks/reminders/useReminderHistory";
import { Ionicons } from "@expo/vector-icons";

const ITEMS_PER_PAGE = 10;

const HistoryScreen = React.memo(() => {
  const colors = useThemeColors();
  const { openDrawer } = useDrawer();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { items, loading } = useReminderHistory();

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const currentItems = items.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
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

  const totalDays = items.length;
  const totalCompleted = items.reduce(
    (sum, item) => sum + item.remindersChecked,
    0,
  );
  const totalReminders = items.reduce(
    (sum, item) => sum + item.totalReminders,
    0,
  );
  const overallPercentage =
    totalReminders > 0
      ? Math.round((totalCompleted / totalReminders) * 100)
      : 0;

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

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
        }}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <Animated.View entering={FadeInUp.duration(300).delay(150)}>
            {totalDays > 0 && (
              <StatsOverviewCard stats={stats} animationDelay={0} />
            )}

            <View className="flex-row items-center justify-between">
              <Text className="text-md font-semibold text-foreground dark:text-foreground-dark mb-3 mt-4 uppercase tracking-wide">
                Daily Records
              </Text>
              {totalDays > 0 && (
                <Text className="text-xs font-bold text-muted-foreground dark:text-muted-foreground-dark uppercase tracking-widest">
                  Page {safePage} of {totalPages}
                </Text>
              )}
            </View>

            {loading ? (
              <View className="py-16 items-center">
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : currentItems.length === 0 ? (
              <View className="items-center justify-center py-16">
                <View className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-4">
                  <Ionicons
                    name="calendar-outline"
                    size={40}
                    color={colors.text}
                  />
                </View>
                <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-2">
                  No History Yet
                </Text>
                <Text className="text-sm text-foreground dark:text-foreground-dark text-center px-8">
                  Daily reminder results will show up here after a reminder is
                  marked done or missed.
                </Text>
              </View>
            ) : (
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
            )}
          </Animated.View>
        </View>

        {totalDays > 0 && (
          <View className="mt-4 mb-24 px-6 py-4 border border-border dark:border-border-dark bg-card dark:bg-card-dark">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                className={`h-12 w-12 items-center justify-center rounded-xl ${
                  safePage === 1
                    ? "opacity-20 bg-muted dark:bg-muted-dark"
                    : "bg-primary dark:bg-primary-dark"
                }`}
              >
                <Text className="text-foreground dark:text-foreground-dark font-bold text-lg">
                  ←
                </Text>
              </TouchableOpacity>

              <View className="items-center">
                <Text className="text-xs font-bold text-muted-foreground dark:text-muted-foreground-dark uppercase tracking-widest">
                  Page {safePage} of {totalPages}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                className={`h-12 w-12 items-center justify-center rounded-xl ${
                  safePage === totalPages
                    ? "opacity-20 bg-muted dark:bg-muted-dark"
                    : "bg-primary dark:bg-primary-dark"
                }`}
              >
                <Text className="text-white font-bold text-lg">→</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
});

HistoryScreen.displayName = "HistoryScreen";

export default HistoryScreen;
