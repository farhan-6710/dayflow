/** Website motion values, copied from eatrrite.com. */

/** Reveals start once an element's top has risen a quarter of the screen. */
export const REVEAL_MARGIN = "0px 0px -25% 0px";

/** Same curve as DayFlow's `Reveal` entrances. */
export const REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Header bar ↔ floating pill. */
export const HEADER_EASE = [0.22, 1, 0.36, 1] as const;
export const HEADER_SCROLL_OFFSET = 40;

/** Feature chapters: GSAP "power3.out" in the original. */
export const CHAPTER_EASE = [0.215, 0.61, 0.355, 1] as const;

export const TESTIMONIAL_AUTOPLAY_MS = 4500;
