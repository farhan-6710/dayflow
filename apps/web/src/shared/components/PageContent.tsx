import { Children } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { FLUID_ITEM, FLUID_LIST } from "@/shared/constants/pageMotion";
import type { PageContentProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

/**
 * Staggers each direct child when `ready` (default true) and `stagger` (default true).
 * Set `stagger={false}` when children drive their own FluidWaveItem delays.
 */
export function PageContent({
  className,
  children,
  motionKey = "page",
  ready = true,
  stagger = true,
}: PageContentProps) {
  const contentClass = cn("w-full min-w-0 space-y-4", className);

  if (!ready) {
    return <div className={contentClass}>{children}</div>;
  }

  if (!stagger) {
    return (
      <AnimatePresence mode="wait">
        <div key={motionKey} className={contentClass}>
          {children}
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={motionKey} className={contentClass} {...FLUID_LIST}>
        {Children.toArray(children).map((child, index) => (
          <motion.div key={index} className="w-full min-w-0" variants={FLUID_ITEM}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
