import { DateFiltersCompact } from "@/shared/components/DateFiltersCompact";
import { DateRangePicker } from "@/shared/components/DateRangePicker";
import { Reveal } from "@/shared/components/Reveal";
import { DATE_FILTER_PERIODS } from "@/shared/constants/dateFilters";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { cn } from "@/shared/lib/utils";
import type { DateFiltersProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

export function DateFilters(props: DateFiltersProps) {
  const isPhone = useMediaQuery("not all and (min-width: 641px)");
  return isPhone ? <DateFiltersCompact {...props} /> : <DateFiltersBar {...props} />;
}

function DateFiltersBar({
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
      <Button
        key={label}
        type="button"
        variant="ghost"
        size="sm"
        aria-pressed={active}
        onClick={onClick}
        className={cn(
          "h-8 shrink-0 rounded-md px-3 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "hover:text-inherit dark:hover:bg-accent",
          active
            ? "bg-primary text-primary-foreground hover:bg-primary! hover:text-primary-foreground"
            : "hover:bg-accent",
        )}
      >
        {label}
      </Button>
    );
  }

  return (
    <Reveal
      role="group"
      aria-label={`Date filter: ${periodLabel}`}
      className="flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card p-1.5"
    >
      {segment("All", isAll, onClearFilters)}
      {DATE_FILTER_PERIODS.map((period) =>
        segment(period.label, activeQuickPeriod === period.id, () => onToggleQuickPeriod(period.id)),
      )}
      <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-border sm:block" />
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
    </Reveal>
  );
}
