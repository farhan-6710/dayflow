import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import Text from "@components/atoms/Text";
import ReminderHistoryList from "./ReminderHistoryList";
import { ReminderHistoryItem } from "@types";
import { useThemeColors } from "@constants/theme";
import PageHeader from "@components/organisms/PageHeader";
import StatsOverviewCard from "@components/organisms/StatsOverviewCard";
import { StatItem } from "@types";
import { Menu } from "lucide-react-native";
import { useDrawer } from "@/providers/DrawerProvider";

interface ReminderHistorySectionProps {
  /** Array of reminder history items to display */
  items: ReminderHistoryItem[];
  /** Callback when a card is pressed */
  onItemPress?: (item: ReminderHistoryItem) => void;
}

const ReminderHistorySection = React.memo<ReminderHistorySectionProps>(
  ({ items, onItemPress }) => {
    const colors = useThemeColors();
    const { openDrawer } = useDrawer();

    // Calculate overall stats
    const totalDays = items.length;
    const totalCompleted = items.reduce(
      (sum, item) => sum + item.remindersChecked,
      0
    );
    const totalReminders = items.reduce(
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
      <View className="flex-1">
        {/* Header Section */}
        <Animated.View
          entering={FadeInUp.duration(300).delay(100)}
          className="mb-4"
          style={{ marginHorizontal: 24 }}
        >
          <PageHeader
            icon="stats-chart"
            iconSize={28}
            iconColor="#ffffff"
            title="History"
            subtitle="Track your daily progress"
            animationDelay={0}
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
        </Animated.View>

        {/* Stats Overview Card */}
        {totalDays > 0 && (
          <StatsOverviewCard stats={stats} animationDelay={150} />
        )}

        {/* History List */}
        <Animated.View
          entering={FadeInUp.duration(300).delay(200)}
          className="flex-1"
        >
          <Text
            className="text-sm font-semibold text-foreground dark:text-foreground-dark mb-3 uppercase tracking-wide"
            style={{ marginHorizontal: 24 }}
          >
            Daily Records
          </Text>
          <ReminderHistoryList items={items} onItemPress={onItemPress} />
        </Animated.View>
      </View>
    );
  }
);

ReminderHistorySection.displayName = "ReminderHistorySection";

export default ReminderHistorySection;
