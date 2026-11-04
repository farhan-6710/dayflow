import type { PillTabsProps } from "@/shared/types/components";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

/** Status and section tabs built on the shared shadcn Tabs primitives. */
export function PillTabs({ label, value, onChange, options }: PillTabsProps) {
  return (
    <Tabs value={value} onValueChange={onChange} className="min-w-0 gap-0">
      <TabsList aria-label={label} variant="solid" size="lg" className="w-full flex-wrap justify-start sm:w-fit">
        {options.map(({ value: optionValue, label: optionLabel, count, icon: Icon }) => (
          <TabsTrigger key={optionValue} value={optionValue} className="group flex-none">
            {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
            {optionLabel}
            {count === undefined ? null : (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-muted px-1.5 py-0.5 text-center text-xs tabular-nums group-data-[state=active]:bg-primary-foreground/15">
                {count}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
