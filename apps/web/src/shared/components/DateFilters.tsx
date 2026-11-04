import { DateRangePicker } from "@/shared/components/DateRangePicker";
import { DATE_FILTER_PERIODS } from "@/shared/constants/dateFilters";
import { cn } from "@/shared/lib/utils";
import type { DateFiltersProps } from "@/shared/types/components";

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

  function segment(label: string, active: boolean, onClick: () => void) {
    return (
      <button
        key={label}
        type="button"
        aria-pressed={active}
        onClick={onClick}
        className={cn(
          "h-8 shrink-0 rounded-md px-3 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          active ? "bg-card shadow-sm" : "hover:bg-card/60",
        )}
      >
        {label}
      </button>
    );
  }

  return (
    <div role="group" aria-label={`Date filter: ${periodLabel}`} className="flex min-w-0 flex-wrap items-center gap-2">
      <div className="flex h-10 max-w-full items-center gap-0.5 overflow-x-auto rounded-lg bg-muted p-1">
        {segment("All", isAll, onClearFilters)}
        {DATE_FILTER_PERIODS.map((period) =>
          segment(period.label, activeQuickPeriod === period.id, () => onToggleQuickPeriod(period.id)),
        )}
      </div>
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
