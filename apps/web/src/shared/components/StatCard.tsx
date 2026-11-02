import { Link } from "react-router";

import { DayflowImage } from "@/shared/components/DayflowImage";
import { StatCardTrend } from "@/shared/components/StatCardTrend";
import type { StatCardItem } from "@/shared/types/statsCards";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

type StatCardProps = {
  card: StatCardItem;
  /** Fallback tint when the card doesn't set its own `tone`. */
  tone: string;
};

export function StatCard({ card, tone }: StatCardProps) {
  const Icon = card.icon;
  const tooltipText =
    card.descriptionTooltip ??
    (card.description ? `${card.label}\n${card.description}` : null);

  const lucideFallback = (
    <span className="grid size-14 shrink-0 place-items-center rounded-full border border-primary/30 bg-[color-mix(in_srgb,var(--primary)_42%,var(--card))] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <Icon className="size-6 text-primary-text" aria-hidden />
    </span>
  );

  const visual = card.imageSrc ? (
    <DayflowImage
      src={card.imageSrc}
      alt=""
      className="size-14 shrink-0 object-contain"
      fallback={lucideFallback}
    />
  ) : (
    lucideFallback
  );

  const description = card.description ? (
    <p className="mt-3 line-clamp-2 text-sm leading-snug text-foreground/70">
      {card.description}
    </p>
  ) : null;

  return (
    <div
      className={cn(
        "surface-elevated animate-enter relative flex items-center justify-between gap-2 rounded-[1.25rem] px-6 pt-6 pb-5",
        card.href && "transition-transform hover:-translate-y-0.5",
        card.tone ?? tone,
      )}
    >
      <div className="min-w-0">
        <p className="text-xs leading-snug font-medium text-foreground">
          {card.href ? (
            <Link
              to={card.href}
              aria-label={`Open ${card.label}`}
              className="after:absolute after:inset-0 after:rounded-[1.25rem] focus-visible:outline-none focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
            >
              {card.label}
            </Link>
          ) : (
            card.label
          )}
        </p>
        <p className="tabular mt-3 font-heading text-[2.875rem] leading-none font-bold">
          {card.value}
        </p>
        {description && tooltipText ? (
          <Tooltip>
            <TooltipTrigger asChild>{description}</TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs whitespace-pre-line">
              {tooltipText}
            </TooltipContent>
          </Tooltip>
        ) : (
          description
        )}
        {card.delta && card.deltaLabel ? (
          <StatCardTrend delta={card.delta} deltaLabel={card.deltaLabel} trend={card.trend} />
        ) : null}
      </div>
      {visual}
    </div>
  );
}
