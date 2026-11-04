import { StatCard } from "@/shared/components/StatCard";
import { StatCardSkeleton } from "@/shared/components/StatCardSkeleton";
import type { StatsCardsProps } from "@/shared/types/components";

const gridClassName = "grid min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4";

export function StatsCards({ cards, isLoading = false }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className={gridClassName} aria-busy="true" aria-label="Loading stats">
        {Array.from({ length: 4 }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {cards.map((card) => (
        <StatCard key={card.id} card={card} />
      ))}
    </div>
  );
}
