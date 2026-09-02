import React from "react";
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

const HistoryScreen = React.memo(() => {
  const colors = useThemeColors();
  const { openDrawer } = useDrawer();

  const handleItemPress = (_item: ReminderHistoryItem) => {};

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
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 70,
          paddingTop: 20,
          paddingHorizontal: 24,
        }}
      >
        <Animated.View entering={FadeInUp.duration(300).delay(150)}>
          <View>
            {totalDays > 0 && (
              <StatsOverviewCard stats={stats} animationDelay={0} />
            )}
          </View>

          <Animated.View entering={FadeInUp.duration(300).delay(200)}>
            <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark mb-3 mt-4 uppercase tracking-wide">
              Daily Records
            </Text>
            <View>
              {REMINDERS_HISTORY.map((item, index) => (
                <ReminderHistoryCard
                  key={item.id}
                  item={item}
                  index={index}
                  onPress={handleItemPress}
                />
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
});

HistoryScreen.displayName = "HistoryScreen";

export default HistoryScreen;
