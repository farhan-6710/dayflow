import { Link } from "react-router";

import { DayflowImage } from "@/shared/components/DayflowImage";
import { Sparkline } from "@/shared/components/Sparkline";
import { StatCardTrend } from "@/shared/components/StatCardTrend";
import { raisedPanelClassName } from "@/shared/constants/layoutStyles";
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

  const lucideFallback = (
    <Icon className="size-5 text-primary-text transition-transform duration-200 group-hover/icon:scale-110" />
  );

  const iconVisual = card.imageSrc ? (
    <DayflowImage
      src={card.imageSrc}
      alt=""
      className="size-11 drop-shadow-sm transition-transform duration-200 group-hover/icon:scale-110"
      fallback={lucideFallback}
    />
  ) : (
    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10">
      {lucideFallback}
    </span>
  );

  const iconButton = (
    <span className="group/icon inline-flex shrink-0 items-center justify-center">
      {iconVisual}
    </span>
  );

  return (
    <div
      className={cn(
        "relative px-4 py-3.5",
        raisedPanelClassName,
        "hover:border-primary/45",
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
            className="shrink-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
