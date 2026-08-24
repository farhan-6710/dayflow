import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import type { DateRange } from "react-day-picker";

import type { DateFilterPeriodId } from "@/shared/constants/dateFilters";
import type {
  DateFiltersFilterState,
  DateFiltersProps,
} from "@/shared/types/components";
import {
  formatDateFiltersLabel,
  formatDateFiltersRangeButtonLabel,
  resolveDateFiltersRange,
} from "@/shared/utils/dateFiltersUtils";

export function useDateFilters() {
  const [filter, setFilter] = useState<DateFiltersFilterState>({
    mode: "all",
  });
  const [pickerRange, setPickerRange] = useState<DateRange | undefined>();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);

  const resolvedRange = useMemo(
    () => resolveDateFiltersRange(filter),
    [filter],
  );

  const periodLabel = useMemo(
    () => formatDateFiltersLabel(filter),
    [filter],
  );

  const rangeButtonLabel = useMemo(
    () => formatDateFiltersRangeButtonLabel(filter),
    [filter],
  );

  const clearFilters = useCallback(() => {
    setPickerError(null);
    setIsPickerOpen(false);
    setPickerRange(undefined);
    setFilter({ mode: "all" });
  }, []);

  const toggleQuickPeriod = useCallback(
    (period: DateFilterPeriodId) => {
      setPickerError(null);
      setIsPickerOpen(false);
      setPickerRange(undefined);

      const isActive = filter.mode === "period" && filter.period === period;
      setFilter(isActive ? { mode: "all" } : { mode: "period", period });
    },
    [filter],
  );

  const clearDateRange = useCallback(() => {
    setPickerError(null);
    setIsPickerOpen(false);
    setPickerRange(undefined);
    setFilter({ mode: "all" });
  }, []);

  const applyDateRange = useCallback(() => {
    if (!pickerRange?.from) {
      setPickerError("Select a start date.");
      return;
    }

    const from = pickerRange.from;
    const to = pickerRange.to ?? pickerRange.from;

    if (to < from) {
      setPickerError("End date must be on or after the start date.");
      return;
    }

    setPickerError(null);
    setIsPickerOpen(false);
    setFilter({ mode: "range", from, to });
  }, [pickerRange]);

  const handlePickerRangeChange = useCallback((range: DateRange | undefined) => {
    setPickerRange(range);
    setPickerError(null);
  }, []);

  const handlePickerOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setPickerRange(
          filter.mode === "range"
            ? { from: filter.from, to: filter.to }
            : undefined,
        );
        setPickerError(null);
      }

      setIsPickerOpen(open);
    },
    [filter],
  );

  const handlePickerKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyDateRange();
      }
    },
    [applyDateRange],
  );

  const activeQuickPeriod =
    filter.mode === "period" ? filter.period : null;
  const isDateRangeActive = filter.mode === "range";

  const dateFilterProps = useMemo<DateFiltersProps>(
    () => ({
      activeQuickPeriod,
      isDateRangeActive,
      periodLabel,
      rangeButtonLabel,
      pickerRange,
      isPickerOpen,
      pickerError,
      onToggleQuickPeriod: toggleQuickPeriod,
      onClearFilters: clearFilters,
      onClearDateRange: clearDateRange,
      onApplyDateRange: applyDateRange,
      onPickerRangeChange: handlePickerRangeChange,
      onPickerOpenChange: handlePickerOpenChange,
      onPickerKeyDown: handlePickerKeyDown,
    }),
    [
      activeQuickPeriod,
      applyDateRange,
      clearDateRange,
      clearFilters,
      handlePickerKeyDown,
      handlePickerOpenChange,
      handlePickerRangeChange,
      isDateRangeActive,
      isPickerOpen,
      periodLabel,
      pickerError,
      pickerRange,
      rangeButtonLabel,
      toggleQuickPeriod,
    ],
  );

  return {
    filter,
    resolvedRange,
    periodLabel,
    dateFilterProps,
  };
}
