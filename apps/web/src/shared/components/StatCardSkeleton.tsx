import { glassPanelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * Size-matched stand-in for StatCard — mirrors label / value+sparkline / description
 * line boxes so height matches the loaded card (no entrance animation).
 */
export function StatCardSkeleton() {
  return (
    <div
      className={cn("relative px-4 py-3.5", glassPanelClassName)}
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* text-[11px] uppercase label row */}
          <div className="flex h-4 items-center">
            <Skeleton className="h-2.5 w-28" />
          </div>

          {/* text-2xl value (leading 2rem) + h-6 sparkline */}
          <div className="mt-1.5 flex h-8 items-center gap-3">
            <Skeleton className="h-7 w-14" />
            <Skeleton className="h-6 w-16" />
          </div>

          {/* text-xs description */}
          <div className="mt-1 flex h-4 items-center">
            <Skeleton className="h-3 w-44 max-w-full" />
          </div>
        </div>

        <Skeleton className="size-9 shrink-0 rounded-full" />
      </div>
    </div>
  );
}
