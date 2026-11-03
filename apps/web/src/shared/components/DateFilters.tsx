import { DateRangePicker } from "@/shared/components/DateRangePicker";
import { DATE_FILTER_PERIODS } from "@/shared/constants/dateFilters";
import { cn } from "@/shared/lib/utils";
import type { DateFiltersProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

export function DateFilters({
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
  const isAll = activeQuickPeriod === null && !isDateRangeActive;

  function pill(label: string, active: boolean, onClick: () => void) {
    return (
      <Button
        key={label}
        variant={active ? "default" : "outline"}
        aria-pressed={active}
        onClick={onClick}
        className={cn("h-10 rounded-lg font-normal", !active && "bg-card")}
      >
        {label}
      </Button>
    );
  }

  return (
    <div role="group" aria-label={`Date filter: ${periodLabel}`} className="flex flex-wrap items-center gap-2">
      {pill("All", isAll, onClearFilters)}
      {DATE_FILTER_PERIODS.map((period) =>
        pill(period.label, activeQuickPeriod === period.id, () => onToggleQuickPeriod(period.id)),
      )}
      <DateRangePicker
        open={isPickerOpen}
        onOpenChange={onPickerOpenChange}
        range={pickerRange}
        rangeLabel={rangeButtonLabel}
        isActive={isDateRangeActive}
        onRangeChange={onPickerRangeChange}
        onApply={onApplyDateRange}
        onClear={onClearDateRange}
        onKeyDown={onPickerKeyDown}
        error={pickerError}
      />
    </div>
  );
}
