import { Link } from "react-router";

import { Reveal } from "@/shared/components/Reveal";
import { StatCardTrend } from "@/shared/components/StatCardTrend";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { StatCardProps } from "@/shared/types/components";

/** Label and icon on top, then the value with its caption on one row, then the trend. */
export function StatCard({ card }: StatCardProps) {
  const { icon: Icon } = card;

  return (
    <Reveal className="h-full min-w-0">
      <article
        className={cn(
          panelClassName,
          "relative flex h-full min-w-0 flex-col p-3 sm:p-4",
          card.href && "transition-transform duration-200 hover:-translate-y-0.5",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 text-sm leading-tight text-muted-foreground sm:pt-1">
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
          <span data-shimmer-no-children className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border sm:size-9">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-2 flex min-w-0 items-baseline gap-2">
          <p className="min-w-14 shrink-0 text-2xl leading-none tabular-nums sm:text-3xl">{card.value}</p>
          {card.description ? (
            <p className="min-w-0 text-xs leading-snug text-muted-foreground text-pretty">{card.description}</p>
          ) : null}
        </div>
        {card.delta ? (
          <div className="mt-2">
            <StatCardTrend delta={card.delta} deltaLabel={card.deltaLabel} trend={card.trend} />
          </div>
        ) : null}
      </article>
    </Reveal>
  );
}
