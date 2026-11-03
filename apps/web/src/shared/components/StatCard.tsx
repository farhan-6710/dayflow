import { Link } from "react-router";

import { DayflowImage } from "@/shared/components/DayflowImage";
import { StatCardTrend } from "@/shared/components/StatCardTrend";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { StatCardProps } from "@/shared/types/components";

export function StatCard({ card }: StatCardProps) {
  return (
    <article
      className={cn(
        panelClassName,
        "relative flex items-start justify-between gap-3 p-5",
        card.href && "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <div className="min-w-0">
        <h3 className="text-sm text-muted-foreground">
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
        <p className="mt-2 text-4xl leading-none tabular-nums">{card.value}</p>
        {card.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{card.description}</p>
        ) : null}
        {card.delta && card.deltaLabel ? (
          <StatCardTrend delta={card.delta} deltaLabel={card.deltaLabel} trend={card.trend} />
        ) : null}
      </div>
      <DayflowImage name={card.image} className="size-14 shrink-0" />
    </article>
  );
}
