import { ChevronDown } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

export type OptionDropdownOption = {
  value: string;
  label: string;
};

export type OptionDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: OptionDropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function OptionDropdown({
  value,
  onChange,
  options,
  placeholder = "Select option",
  disabled = false,
  className,
}: OptionDropdownProps) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 min-w-0 w-full justify-between gap-2 rounded-lg border border-ring/60 bg-card px-3 text-sm font-medium shadow-xs",
            className,
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={cn(value === option.value && "bg-primary/10 text-primary")}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
