import { Children } from "react";

import type { PageContentProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

/**
 * Page body. Each direct child rises in on its own (`animate-enter`) when `ready` and `stagger`
 * (both default true). Set `stagger={false}` when children drive their own entrance.
 */
export function PageContent({
  className,
  children,
  motionKey = "page",
  ready = true,
  stagger = true,
}: PageContentProps) {
  const contentClass = cn("w-full min-w-0 space-y-6", className);

  if (!ready || !stagger) {
    return (
      <div key={motionKey} className={contentClass}>
        {children}
      </div>
    );
  }

  return (
    <div key={motionKey} className={contentClass}>
      {Children.toArray(children).map((child, index) => (
        <div key={index} className="animate-enter w-full min-w-0">
          {child}
        </div>
      ))}
    </div>
  );
}
