import { AnimatePresence, motion } from "framer-motion";

import { FLUID_REVEAL } from "@/shared/constants/pageMotion";
import type { FluidRevealProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

/** Replays the day-panel fade-rise whenever `motionKey` changes. */
export function FluidReveal({ motionKey, className, children }: FluidRevealProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={motionKey} className={cn("w-full min-w-0", className)} {...FLUID_REVEAL}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
