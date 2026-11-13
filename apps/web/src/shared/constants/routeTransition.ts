import type { TransitionLogoMarkTiming } from "@/shared/types/components";

const SHUTTER_EASE = [0.76, 0, 0.24, 1] as const;

/** First load: same timings as ShopNow's WindowOpener. Shutters start closed and open after 1s. */
export const APP_OPENER_ANIMATION = {
  MOUNT_CONTENT_DELAY_MS: 1000,
  CLEANUP_DELAY_MS: 2500,

  SHUTTER: {
    DURATION: 0.8,
    DELAY: 1.0,
    EASE: SHUTTER_EASE,
  },

  MARK: {
    lineWidthDelay: 0.35,
    lineDuration: 0.5,
    lineOpacityDelay: 1.0,
    logoEnterDuration: 0.5,
    logoExitDelay: 1.0,
    logoExitDuration: 0.3,
  } satisfies TransitionLogoMarkTiming,
};

/** Route change shutter: same timings as ShopNow's NavigationWindow. */
export const ROUTE_TRANSITION_ANIMATION = {
  // Opening sequence
  SHUTTER_OPEN_DELAY_MS: 600,
  CLEANUP_DELAY_MS: 2000,

  // Navigation runs once the shutters have closed.
  ROUTER_PUSH_DELAY_MS: 300,

  SHUTTER: {
    DURATION: 0.4,
    EASE: SHUTTER_EASE,
  },

  MARK: {
    lineWidthDelay: 0.3,
    lineDuration: 0.2,
    lineOpacityDelay: 0.5,
    logoEnterDuration: 0.5,
    logoExitDelay: 0.5,
    logoExitDuration: 0.3,
  } satisfies TransitionLogoMarkTiming,
};
