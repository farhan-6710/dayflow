import { useEffect, useRef, useState, type CSSProperties, type ElementType, type HTMLAttributes } from "react";
import { useReducedMotion } from "framer-motion";

import { REVEAL_EASE, REVEAL_MARGIN } from "@/features/site/constants/siteMotion";
import type { BlurInItemProps, BlurInProps } from "@/features/site/types/components";

/** One IntersectionObserver for every reveal on the page. */
const callbacks = new Map<Element, () => void>();
let observer: IntersectionObserver | null = null;

function watch(element: Element, onEnter: () => void) {
  observer ??= new IntersectionObserver(
    (records) => {
      for (const record of records) {
        if (!record.isIntersecting) continue;
        callbacks.get(record.target)?.();
        callbacks.delete(record.target);
        observer?.unobserve(record.target);
      }
    },
    { rootMargin: REVEAL_MARGIN, threshold: 0 },
  );
  callbacks.set(element, onEnter);
  observer.observe(element);
  return () => {
    callbacks.delete(element);
    observer?.unobserve(element);
  };
}

type AppearProps = Omit<HTMLAttributes<HTMLElement>, "style"> & {
  as?: ElementType;
  delay: number;
  duration: number;
  y: number;
  immediate?: boolean;
};

/**
 * Eatrrite's scroll reveal: starts faded, low and blurred, and eases to rest once its top passes
 * a quarter of the screen. Plain CSS transitions; reduced motion shows it at once.
 */
function Appear({ as: Tag = "div", delay, duration, y, immediate = false, ...rest }: AppearProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (immediate) {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
    const element = ref.current;
    return element ? watch(element, () => setShown(true)) : undefined;
  }, [immediate]);

  const timing = `${duration}s ${REVEAL_EASE} ${delay}s`;
  const style: CSSProperties = reducedMotion
    ? {}
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        filter: shown ? "blur(0px)" : "blur(8px)",
        transition: `opacity ${timing}, transform ${timing}, filter ${timing}`,
      };

  return <Tag ref={ref} style={style} {...rest} />;
}

export function BlurIn({ delay = 0, duration = 0.7, y = 24, immediate, ...props }: BlurInProps) {
  return <Appear delay={delay} duration={duration} y={y} immediate={immediate} {...props} />;
}

/** Same reveal for list items, so lists keep valid markup. */
export function BlurInItem({ delay = 0, ...props }: BlurInItemProps) {
  return <Appear as="li" delay={delay} duration={0.7} y={24} {...props} />;
}
