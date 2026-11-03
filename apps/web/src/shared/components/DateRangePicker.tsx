import { CalendarRange, X } from "lucide-react";

import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { cn } from "@/shared/lib/utils";
import type { DateRangePickerProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

export function DateRangePicker({
  open,
  onOpenChange,
  range,
  rangeLabel,
  isActive,
  onRangeChange,
  onApply,
  onClear,
  onKeyDown,
  error,
}: DateRangePickerProps) {
  const isWide = useMediaQuery("(min-width: 768px)");

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center gap-1">
        <PopoverTrigger asChild>
          <Button
            variant={isActive ? "default" : "outline"}
            className={cn("h-10 rounded-lg font-normal", !isActive && "bg-card")}
          >
            <CalendarRange aria-hidden="true" />
            {rangeLabel}
          </Button>
        </PopoverTrigger>
        {isActive ? (
          <Button variant="ghost" size="icon-lg" aria-label="Clear date range" onClick={onClear}>
            <X aria-hidden="true" />
          </Button>
        ) : null}
      </div>
      <PopoverContent className="w-auto p-0" align="end" onKeyDown={onKeyDown}>
        <Calendar
          mode="range"
          selected={range}
          defaultMonth={range?.from}
          numberOfMonths={isWide ? 2 : 1}
          onSelect={onRangeChange}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border p-3">
          <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
            {error ?? "Pick a start and end date."}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onApply} disabled={!range?.from}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
