import { useMemo, useState, type KeyboardEvent } from "react";
import type { DateRange } from "react-day-picker";

import type { DateFilterPeriodId } from "@/shared/constants/dateFilters";
import type { DateFiltersFilterState, DateFiltersProps } from "@/shared/types/components";
import { formatDateFiltersLabel, resolveDateFiltersRange } from "@/shared/utils/dateFiltersUtils";

export function useDateFilters() {
  const [filter, setFilter] = useState<DateFiltersFilterState>({ mode: "all" });
  const [pickerRange, setPickerRange] = useState<DateRange | undefined>();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);

  const resolvedRange = useMemo(() => resolveDateFiltersRange(filter), [filter]);
  const periodLabel = formatDateFiltersLabel(filter);

  function resetTo(next: DateFiltersFilterState) {
    setPickerError(null);
    setIsPickerOpen(false);
    setPickerRange(undefined);
    setFilter(next);
  }

  function toggleQuickPeriod(period: DateFilterPeriodId) {
    const isActive = filter.mode === "period" && filter.period === period;
    resetTo(isActive ? { mode: "all" } : { mode: "period", period });
  }

  function applyDateRange() {
    if (!pickerRange?.from) {
      setPickerError("Select a start date.");
      return;
    }
    setPickerError(null);
    setIsPickerOpen(false);
    setFilter({ mode: "range", from: pickerRange.from, to: pickerRange.to ?? pickerRange.from });
  }

  const dateFilterProps: DateFiltersProps = {
    activeQuickPeriod: filter.mode === "period" ? filter.period : null,
    isDateRangeActive: filter.mode === "range",
    periodLabel,
    rangeButtonLabel: filter.mode === "range" ? periodLabel : "Date range",
    pickerRange,
    isPickerOpen,
    pickerError,
    onToggleQuickPeriod: toggleQuickPeriod,
    onClearFilters: () => resetTo({ mode: "all" }),
    onClearDateRange: () => resetTo({ mode: "all" }),
    onApplyDateRange: applyDateRange,
    onPickerRangeChange: (range) => {
      setPickerRange(range);
      setPickerError(null);
    },
    onPickerOpenChange: (open) => {
      if (open) {
        setPickerRange(filter.mode === "range" ? { from: filter.from, to: filter.to } : undefined);
        setPickerError(null);
      }
      setIsPickerOpen(open);
    },
    onPickerKeyDown: (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyDateRange();
      }
    },
  };

  return { filter, resolvedRange, periodLabel, dateFilterProps };
}
