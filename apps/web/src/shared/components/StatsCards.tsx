import { motion } from "framer-motion";

import { StatCard } from "@/shared/components/StatCard";
import { StatCardSkeleton } from "@/shared/components/StatCardSkeleton";
import {
  FLUID_ITEM,
  fluidRevealTransition,
  fluidStaggerDelay,
} from "@/shared/constants/pageMotion";
import type { StatsCardsProps } from "@/shared/types/components";
import { TooltipProvider } from "@/shared/ui/tooltip";

const cardGridClass =
  "grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4";

export function StatsCards({
  cards,
  isLoading = false,
  getItemDelay = fluidStaggerDelay,
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
          <motion.div
            key={card.id}
            className="min-w-0"
            initial={FLUID_ITEM.initial}
            animate={{ opacity: 1, y: 0 }}
            transition={fluidRevealTransition(getItemDelay(index))}
          >
            <StatCard card={card} />
          </motion.div>
        ))}
      </div>
    </TooltipProvider>
  );
}
