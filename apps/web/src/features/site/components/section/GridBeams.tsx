import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import type { GridBeamsConfig } from "@/features/site/constants/heroBeams";
import { startGridBeams } from "@/features/site/utils/gridBeams";
import { cn } from "@/shared/lib/utils";

/**
 * Coral beams running along a `GridBackground`'s lines and zigzagging at the crossings. Give it the same
 * cell size as the grid it sits on. Nothing is drawn under reduced motion.
 */
export function GridBeams({ config, className }: { config: GridBeamsConfig; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    return startGridBeams(canvas, config);
  }, [config, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      style={{ maskImage: config.mask, WebkitMaskImage: config.mask }}
    />
  );
}
