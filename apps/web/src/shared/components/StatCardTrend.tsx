import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { StatCardTrendProps } from "@/shared/types/components";

export function StatCardTrend({ delta, deltaLabel, trend }: StatCardTrendProps) {
  // The arrow shows direction; colour shows whether that direction is bad for this metric.
  const isBad = trend ? trend === "negative" : delta.startsWith("-");
  const Icon = delta.startsWith("-") ? ArrowDown : delta === "0" ? Minus : ArrowUp;

  return (
    <p className="mt-3 flex items-center gap-1.5 text-xs">
      <span className={cn("inline-flex items-center gap-0.5", isBad && "text-destructive")}>
        <Icon className="size-3.5" aria-hidden="true" />
        {delta}
      </span>
      <span className="text-muted-foreground">{deltaLabel}</span>
    </p>
  );
}
