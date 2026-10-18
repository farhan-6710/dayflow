import { Children } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { FLUID_ITEM, FLUID_LIST } from "@/shared/constants/pageMotion";
import type { PageContentProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

/** Staggers each direct child on mount and whenever `motionKey` changes. */
export function PageContent({
  className,
  children,
  motionKey = "page",
}: PageContentProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={motionKey}
        className={cn("w-full min-w-0 space-y-8", className)}
        {...FLUID_LIST}
      >
        {Children.toArray(children).map((child, index) => (
          <motion.div key={index} className="w-full min-w-0" variants={FLUID_ITEM}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
