import { format } from "date-fns";
import { ListFilter } from "lucide-react";

import { DateRangePicker } from "@/shared/components/DateRangePicker";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { Reveal } from "@/shared/components/Reveal";
import { DATE_FILTER_PERIODS } from "@/shared/constants/dateFilters";
import { cn } from "@/shared/lib/utils";
import type { DateFiltersProps } from "@/shared/types/components";

const ALL_VALUE = "all";
const PERIOD_OPTIONS = [{ value: ALL_VALUE, label: "All" }, ...DATE_FILTER_PERIODS.map(({ id, label }) => ({ value: id, label }))];

/** Phone layout of the date filters: a period dropdown and the date range button, side by side. */
export function DateFiltersCompact({
  activeQuickPeriod,
  isDateRangeActive,
  periodLabel,
  rangeButtonLabel,
  pickerRange,
  isPickerOpen,
  pickerError,
  onToggleQuickPeriod,
  onClearFilters,
  onClearDateRange,
  onApplyDateRange,
  onPickerRangeChange,
  onPickerOpenChange,
  onPickerKeyDown,
}: DateFiltersProps) {
  const value = isDateRangeActive ? "" : (activeQuickPeriod ?? ALL_VALUE);

  function selectPeriod(next: string) {
    if (next === value) return;
    if (next === ALL_VALUE) {
      onClearFilters();
      return;
    }
    const period = DATE_FILTER_PERIODS.find(({ id }) => id === next);
    if (period) onToggleQuickPeriod(period.id);
  }

  const from = pickerRange?.from;
  const to = pickerRange?.to ?? from;
  const shortRange = isDateRangeActive && from && to ? `${format(from, "MMM d")} – ${format(to, "MMM d")}` : rangeButtonLabel;

  return (
    <Reveal role="group" aria-label={`Date filter: ${periodLabel}`} className={cn("grid w-full gap-2", isDateRangeActive ? "grid-cols-[minmax(0,1fr)_auto]" : "grid-cols-2")}>
      <OptionDropdown
        label="Period"
        icon={isDateRangeActive ? undefined : ListFilter}
        value={value}
        placeholder="Custom"
        options={PERIOD_OPTIONS}
        onChange={selectPeriod}
        className="bg-card"
        menuClassName="min-w-44"
      />
      <DateRangePicker
        fullWidth
        open={isPickerOpen}
        onOpenChange={onPickerOpenChange}
        range={pickerRange}
        rangeLabel={shortRange}
        isActive={isDateRangeActive}
        onRangeChange={onPickerRangeChange}
        onApply={onApplyDateRange}
        onClear={onClearDateRange}
        onKeyDown={onPickerKeyDown}
        error={pickerError}
      />
    </Reveal>
  );
}
