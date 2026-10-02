import { useState } from "react";

import { cn } from "@/shared/lib/utils";

type UserAvatarProps = {
  src?: string | null;
  name: string;
  initials: string;
  className?: string;
  imgClassName?: string;
  initialsClassName?: string;
  alt?: string;
};

/**
 * Google avatar CDNs often reject requests that include a localhost Referer.
 * `referrerPolicy="no-referrer"` fixes that; initials cover true load failures.
 */
export function UserAvatar({
  src,
  name,
  initials,
  className,
  imgClassName,
  initialsClassName,
  alt,
}: UserAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && src !== failedSrc;

  if (!showImage) {
    return (
      <span
        className={cn(
          "flex size-full items-center justify-center bg-primary/10 text-sm font-semibold text-primary",
          initialsClassName,
          className,
        )}
        aria-hidden={alt === "" ? true : undefined}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src!}
      alt={alt ?? name}
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(src ?? null)}
      className={cn("size-full object-cover", imgClassName, className)}
    />
  );
}
