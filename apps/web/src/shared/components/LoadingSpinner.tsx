import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type {
  CenteredLoadingProps,
  LoadingSpinnerProps,
  TableLoadingStateProps,
} from "@/shared/types/components";
import { Skeleton } from "@/shared/ui/skeleton";

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const;

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin text-muted-foreground",
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function CenteredLoading({ className }: CenteredLoadingProps) {
  return (
    <div
      className={cn(
        "flex min-h-dvh items-center justify-center bg-background text-foreground",
        className,
      )}
    >
      <LoadingSpinner />
    </div>
  );
}

/** Static table-body placeholder — no entrance motion. */
export function TableLoadingState({ minHeight = 240 }: TableLoadingStateProps) {
  return (
    <div
      className="divide-y divide-border px-6"
      style={{ minHeight }}
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 py-3.5">
          <Skeleton className="h-3.5 w-1/4 max-w-40" />
          <Skeleton className="h-3.5 w-1/5 max-w-28" />
          <Skeleton className="ml-auto h-3.5 w-16" />
        </div>
      ))}
    </div>
  );
}
