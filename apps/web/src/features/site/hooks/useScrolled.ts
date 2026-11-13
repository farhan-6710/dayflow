import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

import { HEADER_SCROLL_OFFSET } from "@/features/site/constants/siteMotion";

/** True once the window has scrolled past `offset` pixels. */
export function useScrolled(offset = HEADER_SCROLL_OFFSET): boolean {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(() => scrollY.get() > offset);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > offset));
  return scrolled;
}
