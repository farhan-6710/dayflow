import { BadgeCheck } from "lucide-react";

import { SPOTLIGHT } from "@/features/site/constants/homeContent";
import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { DayFlowLogo } from "@/shared/components/DayFlowLogo";
import { cn } from "@/shared/lib/utils";

/** Compact plate over the spotlight art: logo mark on a ringed disc, name, note and role. */
export function SpotlightBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex w-fit max-w-[min(calc(100%-1.5rem),17.5rem)] items-center gap-2.5 rounded-xl border border-chart-1/40 bg-background py-2 pr-3 pl-2 shadow-lg sm:max-w-[19rem] sm:gap-3 sm:rounded-2xl sm:py-2.5 sm:pr-3.5 sm:pl-2.5",
        className,
      )}
    >
      <span aria-hidden="true" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-card p-1.5 shadow-xs ring-2 ring-chart-1/40 sm:size-12">
        <DayFlowLogo className="h-auto w-full" />
      </span>
      <span className="min-w-0">
        <span className="flex min-w-0 items-center gap-1 sm:gap-1.5">
          <span className="truncate font-heading text-sm text-foreground sm:text-[15px]">{BRAND_NAME}</span>
          <BadgeCheck aria-label="Verified" className="size-4 shrink-0 fill-primary text-primary-foreground sm:size-5" />
        </span>
        <span className="block truncate text-[11px] leading-snug text-muted-foreground">{SPOTLIGHT.badge.note}</span>
        <span className="block truncate text-xs leading-snug text-foreground/80">{SPOTLIGHT.badge.role}</span>
      </span>
    </div>
  );
}
