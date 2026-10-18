import { StatCardSkeleton } from "@/shared/components/StatCardSkeleton";
import { containMinWidthClassName, glassPanelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

function TodoRowSkeleton() {
  return (
    <div className="flex min-w-0 items-start gap-2 py-3" aria-hidden="true">
      <Skeleton className="mt-0.5 size-5 shrink-0 rounded" />
      <Skeleton className="mt-0.5 size-5 shrink-0 rounded" />
      <div className="min-w-0 flex-1">
        <div className="flex h-5 items-center">
          <Skeleton className="h-3.5 w-3/5 max-w-48" />
        </div>
        <div className="mt-0.5 flex h-4 items-center">
          <Skeleton className="h-3 w-2/5 max-w-32" />
        </div>
      </div>
      <Skeleton className="size-7 shrink-0 rounded-md" />
    </div>
  );
}

/** Full dashboard layout placeholder — static until every section is ready. */
export function DashboardPageSkeleton() {
  return (
    <div className="w-full min-w-0 space-y-4" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-4 lg:grid-cols-3",
          containMinWidthClassName,
        )}
      >
        <div className={cn("space-y-4 lg:col-span-2", containMinWidthClassName)}>
          {/* Task completion chart panel */}
          <div className={cn("p-6", glassPanelClassName)}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64 max-w-full" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
            </div>
            <div className="flex h-75 flex-col justify-end gap-3 pt-4">
              <Skeleton className="h-[55%] w-full rounded-xl" />
              <div className="flex items-end gap-2">
                <Skeleton className="h-16 w-1/6 rounded-md" />
                <Skeleton className="h-24 w-1/6 rounded-md" />
                <Skeleton className="h-20 w-1/6 rounded-md" />
                <Skeleton className="h-28 w-1/6 rounded-md" />
                <Skeleton className="h-14 w-1/6 rounded-md" />
                <Skeleton className="h-20 w-1/6 rounded-md" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className={cn("flex min-h-44 flex-col p-5", glassPanelClassName)}
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-3 w-48 max-w-full" />
                <Skeleton className="mt-4 min-h-20 flex-1 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        <div className={cn("space-y-4", containMinWidthClassName)}>
          {/* Todo list panel */}
          <div className={cn("p-6", glassPanelClassName)}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-4 w-44" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <div className="mt-4 divide-y divide-border">
              <TodoRowSkeleton />
              <TodoRowSkeleton />
              <TodoRowSkeleton />
            </div>
          </div>

          {/* Time tracker panel */}
          <div className={cn("px-6 py-7", glassPanelClassName)}>
            <Skeleton className="h-4 w-28" />
            <div className="mt-6 flex justify-center">
              <Skeleton className="h-12 w-48 sm:h-14" />
            </div>
            <div className="mt-7 flex items-center justify-center gap-3">
              <Skeleton className="size-11 rounded-full" />
              <Skeleton className="size-11 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
