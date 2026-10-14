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
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {label}
      </h2>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 rounded-full border-border bg-background shadow-sm"
          aria-label="Previous month"
          onClick={() => onSelect(shiftMonth(year, month, -1))}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 rounded-full border-border bg-background shadow-sm"
          aria-label="Next month"
          onClick={() => onSelect(shiftMonth(year, month, 1))}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
