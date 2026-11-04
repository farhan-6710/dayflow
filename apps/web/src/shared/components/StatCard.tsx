import { Link } from "react-router";

import { Reveal } from "@/shared/components/Reveal";
import { StatCardTrend } from "@/shared/components/StatCardTrend";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { StatCardProps } from "@/shared/types/components";

/** One left edge for the icon, value and description, with the trend on the right of the value. */
export function StatCard({ card }: StatCardProps) {
  const { icon: Icon } = card;

  return (
    <Reveal className="h-full min-w-0">
      <article
        className={cn(
          panelClassName,
          "relative flex h-full min-w-0 flex-col p-3 sm:p-4",
          card.href && "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md",
        )}
      >
        <div className="flex items-center gap-2.5">
          <span data-shimmer-no-children className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 sm:size-9">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <h3 className="min-w-0 text-sm leading-tight text-muted-foreground">
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
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <p className="min-w-8 text-2xl leading-none tabular-nums sm:min-w-14 sm:text-3xl">{card.value}</p>
          {card.delta ? <StatCardTrend delta={card.delta} deltaLabel={card.deltaLabel} trend={card.trend} /> : null}
        </div>
        {card.description ? (
          <div className="mt-auto pt-3">
            <p className="text-xs text-muted-foreground text-pretty">{card.description}</p>
          </div>
        ) : null}
      </article>
    </Reveal>
  );
}
