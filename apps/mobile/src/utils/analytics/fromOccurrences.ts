import type { CategoryData, DayData, ReminderCategory, ReminderOccurrence, StatItem } from "@types";
import { REMINDER_CATEGORY_LABELS } from "@constants/reminders";
import { calculatePercentage } from "@utils/analytics/calculations";
import { addDays, formatLocalDate } from "@utils/reminderDay";

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const CATEGORY_ICONS: Record<
  ReminderCategory,
  Pick<CategoryData, "icon" | "iconBgClass">
> = {
  health: { icon: "heart", iconBgClass: "bg-green-100 dark:bg-green-900/30" },
  fitness: { icon: "fitness", iconBgClass: "bg-teal-100 dark:bg-teal-900/30" },
  work: { icon: "briefcase", iconBgClass: "bg-blue-100 dark:bg-blue-900/30" },
  personal: { icon: "person", iconBgClass: "bg-purple-100 dark:bg-purple-900/30" },
};

type ThemeColors = ReturnType<
  typeof import("@constants/theme").useThemeColors
>;

function groupByDate(occurrences: ReminderOccurrence[]) {
  const byDate = new Map<string, { checked: number; total: number }>();
  for (const occurrence of occurrences) {
    const current = byDate.get(occurrence.occurrenceDate) ?? {
      checked: 0,
      total: 0,
    };
    current.total += 1;
    if (occurrence.status === "done") current.checked += 1;
    byDate.set(occurrence.occurrenceDate, current);
  }
  return byDate;
}

function isPerfectDay(stats: { checked: number; total: number } | undefined) {
  return Boolean(stats && stats.total > 0 && stats.checked === stats.total);
}

export function buildAnalyticsFromOccurrences(
  occurrences: ReminderOccurrence[],
  colors: ThemeColors,
): {
  stats: StatItem[];
  weekData: DayData[];
  categories: CategoryData[];
  streakData: { currentStreak: number; bestStreak: number };
} {
  const total = occurrences.length;
  const completed = occurrences.filter((item) => item.status === "done").length;
  const byDate = groupByDate(occurrences);
  const activeDays = byDate.size;
  const avgRate = calculatePercentage(completed, total);

  const stats: StatItem[] = [
    {
      icon: "checkmark-circle",
      iconColor: colors.success,
      iconBgClass: "bg-green-100 dark:bg-green-900/30",
      label: "Completed",
      value: completed,
    },
    {
      icon: "trending-up",
      iconColor: colors.primary,
      iconBgClass: "bg-blue-100 dark:bg-blue-900/30",
      label: "Avg Rate",
      value: `${avgRate}%`,
    },
    {
      icon: "calendar",
      iconColor: colors.warning,
      iconBgClass: "bg-amber-100 dark:bg-amber-900/30",
      label: "Active Days",
      value: activeDays,
    },
  ];

  const weekData: DayData[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = formatLocalDate(date);
    const dayStats = byDate.get(key);
    weekData.push({
      day: DAY_SHORT[date.getDay()]!,
      percentage: calculatePercentage(dayStats?.checked ?? 0, dayStats?.total ?? 0),
    });
  }

  const categories: CategoryData[] = (
    ["health", "fitness", "work", "personal"] as ReminderCategory[]
  ).map((category) => {
    const rows = occurrences.filter(
      (item) => (item.category ?? "personal") === category,
    );
    const meta = CATEGORY_ICONS[category];
    return {
      name: REMINDER_CATEGORY_LABELS[category],
      icon: meta.icon,
      iconBgClass: meta.iconBgClass,
      completed: rows.filter((item) => item.status === "done").length,
      total: rows.length,
      iconColor:
        category === "health" || category === "fitness"
          ? colors.success
          : category === "work"
            ? colors.primary
            : "#8B5CF6",
    };
  });

  const today = formatLocalDate();
  let cursor = byDate.has(today) ? today : addDays(today, -1);
  let currentStreak = 0;
  while (isPerfectDay(byDate.get(cursor))) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  let bestStreak = 0;
  let run = 0;
  const dates = [...byDate.keys()].sort();
  if (dates.length > 0) {
    for (let day = dates[0]!; day <= today; day = addDays(day, 1)) {
      if (isPerfectDay(byDate.get(day))) {
        run += 1;
        bestStreak = Math.max(bestStreak, run);
      } else {
        run = 0;
      }
    }
  }

  return {
    stats,
    weekData,
    categories,
    streakData: {
      currentStreak,
      bestStreak: Math.max(bestStreak, currentStreak),
    },
  };
}
