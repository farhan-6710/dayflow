import { Link } from "react-router";

import { Sparkline } from "@/shared/components/Sparkline";
import { StatCardTrend } from "@/shared/components/StatCardTrend";
import { glassPanelClassName } from "@/shared/constants/layoutStyles";
import type { StatCardItem } from "@/shared/types/statsCards";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

type StatCardProps = {
  card: StatCardItem;
};

export function StatCard({ card }: StatCardProps) {
  const Icon = card.icon;
  const tooltipText =
    card.descriptionTooltip ??
    (card.description ? `${card.label}\n${card.description}` : null);

  const iconButton = (
    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/60 text-primary/60 bg-primary/10 transition-all duration-200 group-hover/icon:bg-primary group-hover/icon:text-primary-foreground">
      <Icon className="size-3.5 transition-transform duration-200 group-hover/icon:scale-110" />
    </span>
  );

  return (
    <div
      className={cn(
        "relative px-4 py-3.5 transition-all duration-200",
        glassPanelClassName,
        "hover:border-primary/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="truncate text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            {card.label}
          </span>

          <div className="mt-1.5 flex items-center gap-3">
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              {card.value}
            </span>
            {card.sparklineData ? (
              <Sparkline
                data={card.sparklineData}
                color={card.sparklineColor ?? "var(--chart-1)"}
                className="h-6 w-16"
              />
            ) : null}
          </div>

          {card.description ? (
            tooltipText ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-xs whitespace-pre-line"
                >
                  {tooltipText}
                </TooltipContent>
              </Tooltip>
            ) : (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {card.description}
              </p>
            )
          ) : null}

          {card.delta && card.deltaLabel ? (
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
