import { useMemo } from "react";
import { useThemeColors } from "@constants/theme";
import {
  getAnalyticsStats,
  WEEKLY_TREND_DATA,
  getAnalyticsCategories,
  STREAK_DATA,
} from "@constants/analytics";

/**
 * Hook for managing analytics data with theme-aware colors
 *
 * @returns Analytics data with properly themed colors
 *
 * @example
 * const { stats, weekData, categories, streakData } = useAnalyticsData();
 */
export const useAnalyticsData = () => {
  const colors = useThemeColors();

  const stats = useMemo(() => getAnalyticsStats(colors), [colors]);
  const categories = useMemo(() => getAnalyticsCategories(colors), [colors]);

  return {
    stats,
    weekData: WEEKLY_TREND_DATA,
    categories,
    streakData: STREAK_DATA,
  };
};
