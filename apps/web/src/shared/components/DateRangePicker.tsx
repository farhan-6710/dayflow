import { CalendarRange, X } from "lucide-react";
import { useRef } from "react";

import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { cn } from "@/shared/lib/utils";
import type { DateRangePickerProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

/** The clear button and the date range button, read as one filled control while a range is applied. */
const ACTIVE_PART_CLASS =
  "rounded-none bg-transparent text-inherit hover:bg-primary-foreground/15 hover:text-inherit focus-visible:ring-inset dark:hover:bg-primary-foreground/15";

export function DateRangePicker({
  fullWidth = false,
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
  const triggerRef = useRef<HTMLButtonElement>(null);

  function clearRange() {
    onClear();
    // The clear button is about to go, so keep keyboard focus on the date range button.
    triggerRef.current?.focus();
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <div className={cn("flex min-w-0 items-center", fullWidth && "w-full", isActive && "overflow-hidden rounded-md bg-primary text-primary-foreground")}>
        {isActive ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Clear date range"
              className={cn(ACTIVE_PART_CLASS, "shrink-0", fullWidth ? "size-10" : "size-8")}
              onClick={clearRange}
            >
              <X aria-hidden="true" />
            </Button>
            <span aria-hidden="true" className="h-4 w-px shrink-0 bg-primary-foreground/30" />
          </>
        ) : null}
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant={isActive ? "ghost" : fullWidth ? "outline" : "ghost"}
            className={cn(
              "min-w-0 font-normal",
              fullWidth ? "h-10 flex-1 justify-start" : "h-8 rounded-md px-3",
              fullWidth && !isActive && "bg-card",
              isActive && ACTIVE_PART_CLASS,
              isActive && fullWidth && "px-2.5",
            )}
          >
            <CalendarRange
              className={cn(fullWidth && !isActive && "text-muted-foreground", fullWidth && isActive && "hidden")}
              aria-hidden="true"
            />
            <span className="truncate">{rangeLabel}</span>
          </Button>
        </PopoverTrigger>
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
          <p role={error ? "alert" : undefined} className={cn("text-xs", !error && "text-muted-foreground")}>
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
