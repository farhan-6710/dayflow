import { CategoryData } from "@types";

export const getAnalyticsCategories = (
  colors: ReturnType<typeof import("@constants/theme").useThemeColors>
): CategoryData[] => [
  {
    name: "Health & Fitness",
    icon: "fitness",
    completed: 24,
    total: 28,
    iconColor: colors.success,
    iconBgClass: "bg-green-100 dark:bg-green-900/30",
  },
  {
    name: "Work & Productivity",
    icon: "briefcase",
    completed: 18,
    total: 21,
    iconColor: colors.primary,
    iconBgClass: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    name: "Personal Development",
    icon: "book",
    completed: 15,
    total: 20,
    iconColor: "#8B5CF6",
    iconBgClass: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    name: "Daily Habits",
    icon: "refresh",
    completed: 26,
    total: 28,
    iconColor: colors.warning,
    iconBgClass: "bg-amber-100 dark:bg-amber-900/30",
  },
];
