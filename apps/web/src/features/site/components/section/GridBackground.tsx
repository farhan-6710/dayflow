import type { CSSProperties } from "react";

import { cn } from "@/shared/lib/utils";

type GridBackgroundProps = {
  /** Side of one grid square in px. */
  cellSize?: number;
  /** Where the grid is strongest before fading out, as a CSS position ("top", "center", "50% 30%"). */
  focus?: string;
  /** Line colour; defaults to the theme's text colour at a low strength. */
  lineColor?: string;
  /** Replaces the default radial fade, e.g. to light only the area around the cursor. */
  mask?: string;
  className?: string;
};

/** Grid lines are the text colour at this strength, so they read the same on the light and dark backgrounds. */
const GRID_LINE = "color-mix(in oklab, var(--foreground) 7%, transparent)";

/**
 * Decorative grid of thin lines for a section background. Lines are drawn from the theme's foreground
 * colour, so they follow light and dark mode, and fade out radially from `focus` so edges stay calm.
 * Place inside a `relative` parent; content above it needs `relative` too.
 */
export function GridBackground({ cellSize = 64, focus = "top", lineColor = GRID_LINE, mask, className }: GridBackgroundProps) {
  const fade = mask ?? `radial-gradient(ellipse 70% 60% at ${focus}, black 20%, transparent 75%)`;
  const style: CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
    backgroundSize: `${cellSize}px ${cellSize}px`,
    backgroundPosition: "center top",
    maskImage: fade,
    WebkitMaskImage: fade,
  };

  return <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)} style={style} />;
}
