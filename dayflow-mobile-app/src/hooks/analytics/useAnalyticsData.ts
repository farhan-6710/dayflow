import { useMemo } from "react";
import { useThemeColors } from "@constants/theme";
import { useReminderHistory } from "@hooks/reminders/useReminderHistory";
import { buildAnalyticsFromOccurrences } from "@utils/analytics";

/**
 * Hook for managing analytics data with theme-aware colors
 */
export const useAnalyticsData = () => {
  const colors = useThemeColors();
  const { occurrences, loading } = useReminderHistory();

  const analytics = useMemo(
    () => buildAnalyticsFromOccurrences(occurrences, colors),
    [occurrences, colors],
  );

  return {
    ...analytics,
    loading,
  };
};
