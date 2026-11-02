import { Skeleton } from "@/shared/ui/skeleton";

/** Size-matched stand-in for StatCard (label · large value · hint · visual). */
export function StatCardSkeleton() {
  return <Skeleton className="h-[8.6rem] rounded-[1.25rem]" />;
}
