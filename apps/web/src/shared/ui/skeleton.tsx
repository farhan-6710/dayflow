import { cn } from "@/shared/lib/utils";

/** Static placeholder block — no entrance motion; optional pulse for loading affordance. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
    />
  );
}
