import type { TableSkeletonProps } from "@/shared/types/components";
import { Skeleton } from "@/shared/ui/skeleton";

export function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="divide-y divide-border" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
