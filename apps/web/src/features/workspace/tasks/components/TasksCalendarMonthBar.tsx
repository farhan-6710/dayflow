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
      <h2 className="min-w-0 truncate pl-1 text-2xl leading-none font-bold">
        {label}
      </h2>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={() => onSelect(new Date())}
        >
          Today
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          aria-label="Previous month"
          onClick={() => onSelect(shiftMonth(year, month, -1))}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          aria-label="Next month"
          onClick={() => onSelect(shiftMonth(year, month, 1))}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
