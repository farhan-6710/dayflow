import { Link } from "react-router";

import { DayflowImage } from "@/shared/components/DayflowImage";
import { StatCardSparkline } from "@/shared/components/StatCardSparkline";
import { StatCardTrend } from "@/shared/components/StatCardTrend";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { StatCardProps } from "@/shared/types/components";

export function StatCard({ card }: StatCardProps) {
  return (
    <article
      className={cn(
        panelClassName,
        "relative flex h-full min-w-0 flex-col p-4 sm:p-5",
        card.href && "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="min-w-0 text-sm text-muted-foreground">
          {card.href ? (
            <Link
              to={card.href}
              className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50"
            >
              {card.label}
            </Link>
          ) : (
            card.label
          )}
        </h3>
        <DayflowImage name={card.image} className="size-9 shrink-0 sm:size-10" />
      </div>
      <p className="mt-1 text-3xl leading-none tabular-nums sm:text-4xl">{card.value}</p>
      {card.description ? <p className="mt-2 text-sm text-muted-foreground text-pretty">{card.description}</p> : null}
      {card.delta && card.deltaLabel ? (
        <StatCardTrend delta={card.delta} deltaLabel={card.deltaLabel} trend={card.trend} />
      ) : null}
      {card.sparkline ? (
        <div className="mt-auto">
          <StatCardSparkline values={card.sparkline} />
        </div>
      ) : null}
    </article>
  );
}
