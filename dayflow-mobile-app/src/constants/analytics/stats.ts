import { StatItem } from "@types";

export const getAnalyticsStats = (
  colors: ReturnType<typeof import("@constants/theme").useThemeColors>
): StatItem[] => [
  {
    icon: "checkmark-circle",
    iconColor: colors.success,
    iconBgClass: "bg-green-100 dark:bg-green-900/30",
    label: "Completed",
    value: 142,
  },
  {
    icon: "trending-up",
    iconColor: colors.primary,
    iconBgClass: "bg-blue-100 dark:bg-blue-900/30",
    label: "Avg Rate",
    value: "87%",
  },
  {
    icon: "calendar",
    iconColor: colors.warning,
    iconBgClass: "bg-amber-100 dark:bg-amber-900/30",
    label: "Active Days",
    value: 28,
  },
];
