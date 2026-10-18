import { Loader2 } from "lucide-react";

import { FluidReveal } from "@/shared/components/FluidReveal";
import { StatCard } from "@/shared/components/StatCard";
import type { StatsCardsProps } from "@/shared/types/components";
import { TooltipProvider } from "@/shared/ui/tooltip";

const cardGridClass =
  "grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4";

export function StatsCards({ cards, isLoading = false }: StatsCardsProps) {
  if (isLoading && cards.length === 0) {
    return (
      <FluidReveal motionKey="loading" className={cardGridClass}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-20 items-center justify-center rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm"
          >
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ))}
      </FluidReveal>
    );
  }

  return (
    <TooltipProvider>
      <FluidReveal motionKey="ready" className={cardGridClass}>
        {cards.map((card, idx) => (
          <StatCard key={card.id} card={card} idx={idx} isLoading={isLoading} />
        ))}
      </FluidReveal>
    </TooltipProvider>
  );
}
