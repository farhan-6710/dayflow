import type { FluidRevealProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

/** Replays the content entrance whenever `motionKey` changes (remount → new `animate-enter`). */
export function FluidReveal({ motionKey, className, children }: FluidRevealProps) {
  return (
    <div key={motionKey} className={cn("animate-enter w-full min-w-0", className)}>
      {children}
    </div>
  );
}
