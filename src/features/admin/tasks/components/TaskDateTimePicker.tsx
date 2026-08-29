import { X } from "lucide-react";

import { TaskTimeSelect } from "@/features/admin/tasks/components/TaskTimeSelect";
import type { TaskDateTimePickerProps } from "@/features/admin/tasks/types/components";
import { DatePicker } from "@/shared/components/DatePicker";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function TaskDateTimePicker({
  label = "Due Date",
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  onClear,
  disabled = false,
}: TaskDateTimePickerProps) {
  const hasDate = Boolean(dateValue.trim());
  const summaryLabel = hasDate
    ? [dateValue, timeValue.trim() || null].filter(Boolean).join(" · ")
    : "Pick a due date first";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="block text-xs font-semibold text-muted-foreground">
          {label}
        </span>
        {hasDate && onClear ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="h-auto px-2 py-1 text-[11px] text-muted-foreground"
            onClick={onClear}
            disabled={disabled}
          >
            <X className="size-3" aria-hidden="true" />
            Clear
          </Button>
        ) : null}
      </div>

      <div
        className={cn(
          "grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
        )}
      >
        <DatePicker
          value={dateValue}
          onChange={onDateChange}
          disabled={disabled}
          placeholder="Pick a due date"
        />

        <TaskTimeSelect
          selectedTime={timeValue}
          summaryLabel={summaryLabel}
          listLabel="Due times"
          disabled={disabled || !hasDate}
          onTimeChange={onTimeChange}
        />
      </div>
    </div>
  );
}
