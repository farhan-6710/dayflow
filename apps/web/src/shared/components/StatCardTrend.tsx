import { ArrowDown, ArrowUp } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { StatCardTrendProps } from "@/shared/types/components";

export function StatCardTrend({ delta, deltaLabel, trend }: StatCardTrendProps) {
  const isNegative = trend ? trend === "negative" : delta.startsWith("-");
  const Icon = isNegative ? ArrowDown : ArrowUp;

  return (
    <p className="mt-3 flex items-center gap-1.5 text-xs">
      <span className={cn("inline-flex items-center gap-0.5", isNegative && "text-destructive")}>
        <Icon className="size-3.5" aria-hidden="true" />
        {delta}
      </span>
      <span className="text-muted-foreground">{deltaLabel}</span>
    </p>
  );
}
