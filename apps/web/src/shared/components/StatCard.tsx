import { ArrowUpRight, Loader2 } from "lucide-react";
import { Link } from "react-router";

import { Sparkline } from "@/shared/components/Sparkline";
import { StatCardTrend } from "@/shared/components/StatCardTrend";
import type { StatCardItem } from "@/shared/types/statsCards";
import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

type StatCardProps = {
  card: StatCardItem;
  idx: number;
  isLoading: boolean;
};

export function StatCard({ card, idx, isLoading }: StatCardProps) {
  const isAccent = idx % 2 === 1;
  const tooltipText =
    card.descriptionTooltip ??
    (card.description ? `${card.label}\n${card.description}` : null);

  const iconButton = (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
        isAccent
          ? "border-accent/30 bg-accent/10 text-accent group-hover/icon:border-accent group-hover/icon:bg-accent group-hover/icon:text-accent-foreground"
          : "border-primary/30 bg-primary/10 text-primary group-hover/icon:border-primary group-hover/icon:bg-primary group-hover/icon:text-primary-foreground",
      )}
    >
      <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/icon:rotate-45" />
    </span>
  );

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/70 bg-white/60 px-4 py-3.5 shadow-[0_8px_32px_0_rgba(15,23,42,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-200 hover:border-white/95 dark:border-white/12 dark:bg-card/45 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.08)]",
        isAccent ? "hover:border-accent/50" : "hover:border-primary/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="truncate text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            {card.label}
          </span>

          <div className="mt-1.5 flex items-center gap-3">
            {isLoading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <span className="text-2xl font-semibold tracking-tight text-foreground">
                {card.value}
              </span>
            )}
            {card.sparklineData && !isLoading ? (
              <Sparkline
                data={card.sparklineData}
                color={card.sparklineColor ?? "var(--primary)"}
                className="h-6 w-16"
              />
            ) : null}
          </div>

          {card.description && !isLoading ? (
            tooltipText ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs whitespace-pre-line">
                  {tooltipText}
                </TooltipContent>
              </Tooltip>
            ) : (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {card.description}
              </p>
            )
          ) : null}

          {card.delta && card.deltaLabel && !isLoading ? (
            <StatCardTrend
              delta={card.delta}
              deltaLabel={card.deltaLabel}
              trend={card.trend}
            />
          ) : null}
        </div>

        {card.href ? (
          <Link
            to={card.href}
            aria-label={`Open ${card.label}`}
            className="group/icon shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {iconButton}
          </Link>
        ) : (
          iconButton
        )}
      </div>
    </div>
  );
}
