import { cn } from "@/shared/lib/utils";
import type { PillTabsProps } from "@/shared/types/components";

/** Pill row for a list's status tabs and a detail page's sections. */
export function PillTabs({ label, value, onChange, options }: PillTabsProps) {
  return (
    <div role="group" aria-label={label} className="flex min-w-0 flex-wrap items-center gap-1">
      {options.map(({ value: optionValue, label: optionLabel, count, icon: Icon }) => {
        const active = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(optionValue)}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              active ?"bg-primary text-primary-foreground" :"hover:bg-accent",
            )}
          >
            {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
            {optionLabel}
            {count === undefined ? null : (
              <span
                className={cn(
                  "min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs tabular-nums",
                  active ?"bg-primary-foreground/15" :"bg-muted",
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
