/** Shared easing — smooth deceleration for all portal motion. */
export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

/** Route transition on <main> — exit slides down, enter slides up. */
export const PAGE_MAIN_MOTION = {
  initial: { opacity: 0, y: 20, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.22, ease: MOTION_EASE },
  },
  exit: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
    transition: { duration: 0.22, ease: MOTION_EASE },
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

/** In-page section stagger — parent + child variants for PageContent. */
export const SECTION_STAGGER_CONTAINER = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export const SECTION_STAGGER_ITEM = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: MOTION_EASE },
  },
};
