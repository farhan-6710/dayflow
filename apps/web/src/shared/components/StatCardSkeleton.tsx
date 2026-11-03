import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <div className={cn(panelClassName, "flex items-start justify-between gap-3 p-5")}>
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="size-14 rounded-xl" />
    </div>
  );
}
