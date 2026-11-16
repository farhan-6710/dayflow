/**
 * Hero grid beams: coral light that runs along the grid lines and zigzags at the crossings.
 * Tune the effect here; `GridBeams` and `utils/gridBeams.ts` read nothing else.
 */

type Range = { min: number; max: number };

export type GridBeamsConfig = {
  /** Side of one grid square in px. The hero grid uses the same value, so beams sit on its lines. */
  cellSize: number;
  /** How many beams can be on the grid at once. */
  count: number;
  /** Travel speed of a beam's head, in px per second (each beam picks a value in the range). */
  speed: Range;
  /** Length of the glowing tail behind the head, in px. */
  trailLength: Range;
  /** Stroke width of the tail, in px. The grid lines are 1px, so a little wider reads as lit. */
  lineWidth: number;
  /** Radius of the bright dot at the head, in px. */
  headRadius: number;
  /** Glow blur around the tail and head, in px. 0 turns the glow off. */
  glow: number;
  /** Peak opacity of a beam, 0 to 1. */
  opacity: number;
  /** Chance of turning at each crossing, 0 (always straight) to 1 (always turn). */
  turnChance: number;
  /** Chance that a turn goes the opposite way to the last one, which makes the staircase zigzag. */
  zigzag: number;
  /** Grid segments a beam travels before it fades out and a new one starts elsewhere. */
  segments: Range;
  /** Fade-out time at the end of a beam's run, in ms. */
  fadeMs: number;
  /** Pause before a faded beam starts again somewhere new, in ms. */
  respawnDelay: Range;
  /**
   * Width in px of a band down the middle that beams never enter, so the heading and description stay
   * clear. Beams run only in the columns left and right of it; on screens narrower than this, none show.
   */
  clearWidth: number;
  /** Where beams may start, as fractions of the hero's height (the grid fades out lower down). */
  spawnRows: { top: number; bottom: number };
  /** Soft edge for the beam layer, so beams fade with the grid instead of stopping at a hard line. */
  mask: string;
};

export const HERO_BEAMS: GridBeamsConfig = {
  cellSize: 64,
  count: 10,
  speed: { min: 110, max: 190 },
  trailLength: { min: 140, max: 260 },
  lineWidth: 1.5,
  headRadius: 2,
  glow: 12,
  opacity: 1,
  turnChance: 0.55,
  zigzag: 0.75,
  segments: { min: 8, max: 18 },
  fadeMs: 700,
  respawnDelay: { min: 300, max: 1800 },
  clearWidth: 800,
  spawnRows: { top: 0, bottom: 0.7 },
  mask: "radial-gradient(ellipse 85% 75% at top, black 40%, transparent 90%)",
};
