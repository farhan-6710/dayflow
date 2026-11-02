import { CalendarRange, X } from "lucide-react";

import type { DateRangePickerProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";

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
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {isActive ? (
        <div
          className={cn(
            "btn-elevated btn-primary inline-flex h-8 items-center overflow-hidden rounded-full text-xs font-medium",
          )}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex h-full cursor-pointer items-center gap-1.5 px-3"
            >
              <CalendarRange className="size-3 shrink-0" aria-hidden="true" />
              <span>{rangeLabel}</span>
            </button>
          </PopoverTrigger>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onClear();
            }}
            className="inline-flex h-full cursor-pointer items-center border-l border-primary-foreground/20 px-2"
            aria-label="Clear date range"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "surface-chip inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-medium text-foreground/75 transition-[filter,transform] hover:-translate-y-px hover:text-foreground hover:brightness-[1.02]",
            )}
          >
            <CalendarRange className="size-3 shrink-0" aria-hidden="true" />
            <span>{rangeLabel}</span>
          </button>
        </PopoverTrigger>
      )}
      <PopoverContent
        className="z-[80] w-auto overflow-hidden rounded-xl p-0 shadow-md"
        align="end"
        onKeyDown={onKeyDown}
      >
        <Calendar
          mode="range"
          selected={range}
          defaultMonth={range?.from}
          numberOfMonths={2}
          onSelect={onRangeChange}
          className="rounded-md border-none"
        />
        <div className="space-y-2 border-t border-foreground/10 px-4 py-3">
          {error ? (
            <p className="text-xs text-destructive">{error}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Pick a start and end date, then apply.
            </p>
          )}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onApply}
              disabled={!range?.from}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
