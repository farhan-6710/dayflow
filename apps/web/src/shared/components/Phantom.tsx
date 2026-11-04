import { useContext, useLayoutEffect, useRef, type ReactNode } from "react";
import "@aejkatappaja/phantom-ui";

import { SkeletonContext } from "@/shared/lib/skeletonContext";

/**
 * Loading state: phantom-ui measures the real layout inside and shimmers over it. Render it only
 * while loading, because its host clips overflow, which would cut card shadows afterwards.
 * A Phantom inside another adds nothing, so a whole screen can wrap parts that have their own.
 */
export function Phantom({ className, children }: { className?: string; children: ReactNode }) {
  const nested = useContext(SkeletonContext);
  const hostRef = useRef<HTMLElement>(null);

  // phantom-ui only draws an element's child elements, which loses the text of something like an
  // icon beside a title. Mark those as one block. Runs before it measures, on its next microtask.
  useLayoutEffect(() => {
    for (const element of hostRef.current?.querySelectorAll("*") ?? []) {
      const hasText = [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
      if (hasText && element.children.length > 0) {
        element.setAttribute("data-shimmer-no-children", "");
      }
    }
  });

  if (nested) {
    return children;
  }

  return (
    <SkeletonContext.Provider value={true}>
      <phantom-ui
        ref={hostRef}
        loading
        className={className}
        background-color="var(--muted)"
        shimmer-color="color-mix(in oklab, var(--card) 70%, transparent)"
        fallback-radius={6}
      >
        {children}
      </phantom-ui>
    </SkeletonContext.Provider>
  );
}
