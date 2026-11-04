import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { StatCardTrendProps } from "@/shared/types/components";

/** Direction from the delta; colour from whether that move is good for this metric. */
export function StatCardTrend({ delta, deltaLabel, trend }: StatCardTrendProps) {
  const isFlat = /^[+-]?0%?$/.test(delta);
  const isBad = !isFlat && (trend ? trend === "negative" : delta.startsWith("-"));
  const Icon = isFlat ? Minus : delta.startsWith("-") ? ArrowDownRight : ArrowUpRight;

  return (
    <span className="inline-flex min-w-0 flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-md border px-1.5 text-xs font-medium tabular-nums",
          isFlat && "border-border bg-background text-muted-foreground",
          isBad &&
            "border-insight-down-border bg-insight-down-bg text-insight-down",
          !isFlat &&
            !isBad &&
            "border-insight-up-border bg-insight-up-bg text-insight-up",
        )}
      >
        <Icon className="size-3.5 opacity-80" aria-hidden="true" />
        {delta}
      </span>
      {deltaLabel ? (
        <span className="text-xs text-muted-foreground">{deltaLabel}</span>
      ) : null}
    </span>
  );
}
