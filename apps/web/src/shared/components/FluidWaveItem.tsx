import { motion } from "framer-motion";
import type { ReactNode } from "react";

import {
  FLUID_ITEM,
  fluidRevealTransition,
  fluidStaggerDelay,
} from "@/shared/constants/pageMotion";
import { cn } from "@/shared/lib/utils";

type FluidWaveItemProps = {
  /** Wave step — same index shares the same delay (top-left → bottom-right). */
  index: number;
  className?: string;
  children: ReactNode;
};

/** Fade-rise entrance timed to the shared fluid stagger wave. */
export function FluidWaveItem({
  index,
  className,
  children,
}: FluidWaveItemProps) {
  return (
    <motion.div
      className={cn("min-w-0", className)}
      initial={FLUID_ITEM.initial}
      animate={{ opacity: 1, y: 0 }}
      transition={fluidRevealTransition(fluidStaggerDelay(index))}
    >
      {children}
    </motion.div>
  );
}
