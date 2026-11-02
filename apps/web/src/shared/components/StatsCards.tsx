import { StatCard } from "@/shared/components/StatCard";
import { StatCardSkeleton } from "@/shared/components/StatCardSkeleton";
import type { StatsCardsProps } from "@/shared/types/components";
import { TooltipProvider } from "@/shared/ui/tooltip";

/** Trail stat tints, cycled by position. */
const STAT_TONES = ["tone-success", "tone-primary", "tone-rose", "tone-lavender"];

const cardGridClass =
  "grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4";

export function StatsCards({
  cards,
  isLoading = false,
}: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className={cardGridClass} aria-busy="true" aria-label="Loading stats">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cardGridClass}>
        {cards.map((card, index) => (
          <StatCard key={card.id} card={card} tone={STAT_TONES[index % STAT_TONES.length]} />
        ))}
      </div>
    </TooltipProvider>
  );
}
