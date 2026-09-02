import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { DatePickerProps } from "@/shared/types/components";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { parseUrlDateParam, serializeUrlDate } from "@/shared/utils/urlDateParams";

const triggerClassName =
  "h-auto w-full justify-start gap-2 rounded-lg border border-ring/60 bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs hover:bg-muted/50 dark:border-input dark:bg-muted/40";

export function DatePicker({
  id,
  label,
  value,
  onChange,
  disabled = false,
  placeholder = "Select date",
  clearable = false,
  onClear,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseUrlDateParam(value || null);

  const displayValue = selectedDate
    ? format(selectedDate, "MMMM do yyyy")
    : placeholder;

  const picker = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(triggerClassName, className)}
        >
          <CalendarIcon className="size-3.5 opacity-70" aria-hidden="true" />
          <span className={cn(!selectedDate && "text-muted-foreground")}>
            {displayValue}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-100 w-auto border-muted-foreground/10 p-0 shadow-2xl"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={(date) => {
            if (!date) {
              return;
            }

            onChange(serializeUrlDate(date));
            setOpen(false);
          }}
          className="rounded-md border-none"
        />
      </PopoverContent>
    </Popover>
  );

  if (!label) {
    return picker;
  }

  return (
    <div className={formFieldGroupClassName}>
      <div className="flex items-center justify-between gap-2">
        <span className={formLabelClassName}>{label}</span>
        {clearable && value && onClear ? (
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
      {picker}
    </div>
  );
}
