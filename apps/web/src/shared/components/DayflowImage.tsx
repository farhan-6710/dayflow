import { useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type DayflowImageProps = {
  src: string;
  alt?: string;
  className?: string;
  /** Shown when the PNG is missing or fails to load. */
  fallback?: ReactNode;
};

/**
 * Renders a DayFlow asset with Lucide (or other) fallback until art is present.
 */
export function DayflowImage({
  src,
  alt = "",
  className,
  fallback,
}: DayflowImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={cn("object-contain", className)}
      onError={() => setFailed(true)}
    />
  );
}
