import { motion } from "framer-motion";

import { StatCard } from "@/shared/components/StatCard";
import { StatCardSkeleton } from "@/shared/components/StatCardSkeleton";
import { FLUID_ITEM, FLUID_LIST } from "@/shared/constants/pageMotion";
import type { StatsCardsProps } from "@/shared/types/components";
import { TooltipProvider } from "@/shared/ui/tooltip";

const cardGridClass =
  "grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4";

export function StatsCards({ cards, isLoading = false }: StatsCardsProps) {
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
      <motion.div className={cardGridClass} {...FLUID_LIST}>
        {cards.map((card) => (
          <motion.div key={card.id} variants={FLUID_ITEM} className="min-w-0">
            <StatCard card={card} />
          </motion.div>
        ))}
      </motion.div>
    </TooltipProvider>
  );
}
