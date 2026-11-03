import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import type { UserAvatarProps } from "@/shared/types/components";

/**
 * Google avatar CDNs often reject requests with a localhost Referer, so the
 * referrer is dropped; initials cover true load failures.
 */
export function UserAvatar({ src, initials, alt = "", className }: UserAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || src === failedSrc) {
    return (
      <span
        aria-hidden={alt === "" ? true : undefined}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground",
          className,
        )}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(src)}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  );
}
