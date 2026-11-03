import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import { cn } from "@/shared/lib/utils";
import type { DatePickerProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { parseDateValue, serializeDateValue } from "@/shared/utils/dateValue";

export function DatePicker({
  id,
  label,
  value,
  onChange,
  disabled = false,
  placeholder = "Select date",
  onClear,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseDateValue(value);

  const picker = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn("h-10 w-full justify-start font-normal", className)}
        >
          <CalendarIcon className="text-muted-foreground" aria-hidden="true" />
          <span className={cn(!selected && "text-muted-foreground")}>
            {selected ? format(selected, "MMMM do, yyyy") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            if (date) {
              onChange(serializeDateValue(date));
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );

  if (!label) {
    return picker;
  }

  return (
    <div className={formFieldGroupClassName}>
      <div className="flex min-h-6 items-center justify-between gap-2">
        <label htmlFor={id} className={formLabelClassName}>
          {label}
        </label>
        {onClear && value ? (
          <Button variant="ghost" size="xs" disabled={disabled} onClick={onClear}>
            <X aria-hidden="true" />
            Clear
          </Button>
        ) : null}
      </div>
      {picker}
    </div>
  );
}
