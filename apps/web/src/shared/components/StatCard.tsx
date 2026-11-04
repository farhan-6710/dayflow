import { Link } from "react-router";

import { Reveal } from "@/shared/components/Reveal";
import { StatCardTrend } from "@/shared/components/StatCardTrend";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { StatCardProps } from "@/shared/types/components";

export function StatCard({ card }: StatCardProps) {
  const { icon: Icon } = card;

  return (
    <Reveal className="h-full min-w-0">
      <article
        className={cn(
          panelClassName,
          "relative flex h-full min-w-0 flex-col p-3 sm:p-5",
          card.href && "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md",
        )}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 sm:size-10">
            <Icon className="size-4 sm:size-5" aria-hidden="true" />
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
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 sm:pl-13">
          <p className="text-2xl leading-none tabular-nums sm:text-3xl">{card.value}</p>
          {card.delta ? <StatCardTrend delta={card.delta} deltaLabel={card.deltaLabel} trend={card.trend} /> : null}
        </div>
        {card.description ? <p className="mt-2 text-sm text-muted-foreground text-pretty">{card.description}</p> : null}
      </article>
    </Reveal>
  );
}
