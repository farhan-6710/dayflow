/** Shared easing — smooth deceleration for shell chrome. */
export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

/** Same curve as the tasks day panel — watery ease-out. */
export const FLUID_EASE = [0.16, 1, 0.3, 1] as const;

/** Route transition on <main> — no filter, so glass backdrops stay intact. */
export const PAGE_MAIN_MOTION = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: FLUID_EASE },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.18, ease: FLUID_EASE },
  },
};

/** Shell chrome — once per portal load. */
export const SHELL_SIDEBAR_MOTION = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.38, ease: MOTION_EASE },
};

export const SHELL_HEADER_MOTION = {
  initial: { opacity: 0, y: -14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: MOTION_EASE, delay: 0.06 },
};

/** Staggered list — same enter/exit as the calendar day panel. */
export const FLUID_LIST = {
  variants: {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: FLUID_EASE, staggerChildren: 0.045 },
    },
    exit: { opacity: 0, y: -8, transition: { duration: 0.16, ease: FLUID_EASE } },
  },
  initial: "initial",
  animate: "animate",
  exit: "exit",
} as const;

export const FLUID_ITEM = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -6 },
} as const;

/** Single block fade-rise for loading swaps and month changes. */
export const FLUID_REVEAL = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: FLUID_EASE },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.16, ease: FLUID_EASE },
  },
} as const;

export const SECTION_STAGGER_CONTAINER = FLUID_LIST.variants;
export const SECTION_STAGGER_ITEM = {
  hidden: FLUID_ITEM.initial,
  show: {
    ...FLUID_ITEM.animate,
    transition: { duration: 0.32, ease: FLUID_EASE },
  },
};
