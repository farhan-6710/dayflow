import { Phantom } from "@/shared/components/Phantom";
import { StatCard } from "@/shared/components/StatCard";
import type { StatsCardsProps } from "@/shared/types/components";

const gridClassName = "grid min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4";

export function StatsCards({ cards, isLoading = false }: StatsCardsProps) {
  const grid = (
    <div className={gridClassName}>
      {cards.map((card) => (
        <StatCard key={card.id} card={card} />
      ))}
    </div>
  );

  return isLoading ? <Phantom>{grid}</Phantom> : grid;
}
