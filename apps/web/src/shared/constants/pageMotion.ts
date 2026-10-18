/** Shared easing — smooth deceleration for shell chrome. */
export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

/** Same curve as the tasks day panel — watery ease-out. */
export const FLUID_EASE = [0.16, 1, 0.3, 1] as const;

/** Route transition on <main> — no filter, so glass backdrops stay intact. */
export const PAGE_MAIN_MOTION = {
  initial: { opacity: 0, y: 22 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: FLUID_EASE, delay: 0.08 },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.24, ease: FLUID_EASE },
  },
};

/** Shell chrome — once per portal load. Sidebar timings left as-is (feel perfect). */
export const SHELL_SIDEBAR_MOTION = {
  initial: { opacity: 0, x: -22 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.42, ease: MOTION_EASE },
};

export const SHELL_HEADER_MOTION = {
  initial: { opacity: 0, y: -18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.58, ease: MOTION_EASE, delay: 0.08 },
};

/** Stagger children inside shell chrome (nav links, header controls). */
export const SHELL_STAGGER = {
  variants: {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.048, delayChildren: 0.1 },
    },
  },
  initial: "initial" as const,
  animate: "animate" as const,
};

/** Sidebar nav item — keep snappy (user-approved). */
export const SHELL_NAV_ITEM = {
  initial: { opacity: 0, x: -14 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: FLUID_EASE },
  },
};

export const SHELL_HEADER_ITEM = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: FLUID_EASE },
  },
};

/** Staggered list — page sections / card grids (slower wave). */
export const FLUID_LIST = {
  variants: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.58,
        ease: FLUID_EASE,
        staggerChildren: 0.09,
        delayChildren: 0.12,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.22, ease: FLUID_EASE },
    },
  },
  initial: "initial" as const,
  animate: "animate" as const,
  exit: "exit" as const,
};

export const FLUID_ITEM = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: FLUID_EASE },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.22, ease: FLUID_EASE },
  },
} as const;

/** Single block fade-rise for loading swaps and month changes. */
export const FLUID_REVEAL = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: FLUID_EASE },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.22, ease: FLUID_EASE },
  },
} as const;

export const SECTION_STAGGER_CONTAINER = FLUID_LIST.variants;
export const SECTION_STAGGER_ITEM = {
  hidden: FLUID_ITEM.initial,
  show: {
    opacity: FLUID_ITEM.animate.opacity,
    y: FLUID_ITEM.animate.y,
    transition: { duration: 0.55, ease: FLUID_EASE },
  },
};
