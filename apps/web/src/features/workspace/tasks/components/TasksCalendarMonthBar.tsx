import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/shared/ui/button";

type TasksCalendarMonthBarProps = {
  year: number;
  month: number;
  onSelect: (date: Date) => void;
};

function shiftMonth(year: number, month: number, delta: number): Date {
  return new Date(year, month - 1 + delta, 1);
}

export function TasksCalendarMonthBar({
  year,
  month,
  onSelect,
}: TasksCalendarMonthBarProps) {
  const label = format(new Date(year, month - 1, 1), "MMMM yyyy");

  return (
    <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-3">
      <h2 className="min-w-0 truncate text-base font-semibold tracking-tight text-foreground sm:text-xl">
        {label}
      </h2>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-full px-2 text-[11px] sm:h-8 sm:px-3 sm:text-xs"
          onClick={() => onSelect(new Date())}
        >
          Today
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7 rounded-full sm:size-8"
          aria-label="Previous month"
          onClick={() => onSelect(shiftMonth(year, month, -1))}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7 rounded-full sm:size-8"
          aria-label="Next month"
          onClick={() => onSelect(shiftMonth(year, month, 1))}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
