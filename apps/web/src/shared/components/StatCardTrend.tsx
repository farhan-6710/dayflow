import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { StatCardTrendProps } from "@/shared/types/components";

/** The arrow shows direction; colour shows whether that direction is good for this metric. */
export function StatCardTrend({ delta, deltaLabel, trend }: StatCardTrendProps) {
  const isFlat = /^[+-]?0%?$/.test(delta);
  const isBad = !isFlat && (trend ? trend === "negative" : delta.startsWith("-"));
  const Icon = isFlat ? Minus : delta.startsWith("-") ? ArrowDown : ArrowUp;

  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full px-2 text-xs tabular-nums",
        isFlat && "bg-muted text-muted-foreground",
        isBad && "bg-destructive/10 [&_svg]:text-destructive",
        !isFlat && !isBad && "bg-success/15 text-success-text",
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {delta}
      {deltaLabel ? <span className="sr-only">{deltaLabel}</span> : null}
    </span>
  );
}
