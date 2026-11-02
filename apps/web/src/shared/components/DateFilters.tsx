import { useState } from "react";

import { DateRangePicker } from "@/shared/components/DateRangePicker";
import { DATE_FILTER_PERIODS } from "@/shared/constants/dateFilters";
import type { DateFiltersProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

const filterPillClassName =
  "inline-flex h-8 cursor-pointer items-center rounded-full px-3 text-xs font-medium transition-[filter,transform] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";
const filterPillActiveClassName = "btn-elevated btn-primary";
const filterPillIdleClassName =
  "surface-chip text-foreground/75 hover:-translate-y-px hover:text-foreground hover:brightness-[1.02]";

export function DateFilters({
  activeQuickPeriod,
  isDateRangeActive,
  periodLabel,
  rangeButtonLabel,
  pickerRange,
  pickerError,
  onToggleQuickPeriod,
  onClearFilters,
  onClearDateRange,
  onApplyDateRange,
  onPickerRangeChange,
  onPickerOpenChange,
  onPickerKeyDown,
}: DateFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAll = activeQuickPeriod === null && !isDateRangeActive;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          onClearFilters();
        }}
        className={cn(
          filterPillClassName,
          isAll ? filterPillActiveClassName : filterPillIdleClassName,
        )}
      >
        All
      </button>

      {DATE_FILTER_PERIODS.map((period) => {
        const isActive = activeQuickPeriod === period.id;

        return (
          <button
            key={period.id}
            type="button"
            onClick={() => {
              setIsOpen(false);
              onToggleQuickPeriod(period.id);
            }}
            className={cn(
              filterPillClassName,
              isActive ? filterPillActiveClassName : filterPillIdleClassName,
            )}
          >
            {period.label}
          </button>
        );
      })}

      <DateRangePicker
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) {
            onPickerOpenChange(true);
          }
        }}
        range={pickerRange}
        rangeLabel={rangeButtonLabel}
        isActive={isDateRangeActive}
        onRangeChange={onPickerRangeChange}
        onApply={() => {
          setIsOpen(false);
          onApplyDateRange();
        }}
        onClear={() => {
          setIsOpen(false);
          onClearDateRange();
        }}
        onKeyDown={onPickerKeyDown}
        error={pickerError}
      />

      {!isAll ? (
        <span className="sr-only">Active period: {periodLabel}</span>
      ) : null}
    </div>
  );
}
