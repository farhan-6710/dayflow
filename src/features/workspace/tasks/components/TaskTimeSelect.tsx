import { useState } from "react";
import { ChevronDown, Clock3 } from "lucide-react";

import { TASK_AVAILABLE_TIMES } from "@/features/admin/tasks/constants/tasksCalendar";
import type { TaskTimeSelectProps } from "@/features/admin/tasks/types/components";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";

export function TaskTimeSelect({
  selectedTime,
  summaryLabel,
  listLabel = "Select time",
  onTimeChange,
  disabled = false,
}: TaskTimeSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          className="h-auto w-full justify-between gap-2 rounded-lg border border-ring/60 bg-card px-3 py-2 text-sm font-medium shadow-xs hover:bg-muted/50"
        >
          <span className="flex items-center gap-2">
            <Clock3 className="size-3.5 opacity-70" aria-hidden="true" />
            {selectedTime.trim() ? selectedTime : "Select time"}
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 opacity-50 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="z-[100] flex max-h-80 w-[var(--radix-popover-trigger-width)] flex-col overflow-hidden p-0 shadow-2xl"
      >
        <div className="shrink-0 border-b border-border px-4 py-3">
          <p className="text-center text-sm font-medium">{listLabel}</p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            {summaryLabel}
          </p>
        </div>
        <div
          role="listbox"
          aria-label={listLabel}
          className="min-h-0 flex-1 overflow-y-auto p-4"
        >
          <div className="grid grid-cols-1 gap-2">
            {TASK_AVAILABLE_TIMES.map((time) => {
              const isSelected =
                time.toLowerCase() === selectedTime.trim().toLowerCase();

              return (
                <Button
                  key={time}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  className="w-full shrink-0 justify-center"
                  onClick={() => {
                    onTimeChange(time);
                    setOpen(false);
                  }}
                >
                  {time}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
