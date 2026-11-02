import { ChevronDown } from "lucide-react";

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
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "surface-chip flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-[0.8rem] bg-card px-3 text-sm whitespace-nowrap transition-[filter] outline-none hover:brightness-[1.02] focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={cn(value === option.value && "bg-accent font-medium text-accent-foreground")}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
