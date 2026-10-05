import { Loader2 } from "lucide-react";

import { StatCard } from "@/shared/components/StatCard";
import type { StatsCardsProps } from "@/shared/types/components";
import { TooltipProvider } from "@/shared/ui/tooltip";

export function StatsCards({ cards, isLoading = false }: StatsCardsProps) {
  if (isLoading && cards.length === 0) {
    return (
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-20 items-center justify-center rounded-2xl border border-white/70 bg-white/60 px-4 py-3.5 shadow-[0_8px_32px_0_rgba(15,23,42,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/12 dark:bg-card/45 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.08)]"
          >
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => (
          <StatCard
            key={card.id}
            card={card}
            idx={idx}
            isLoading={isLoading}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}
