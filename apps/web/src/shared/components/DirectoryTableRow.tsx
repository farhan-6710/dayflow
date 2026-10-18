import { forwardRef, type CSSProperties, type KeyboardEvent } from "react";

import type { DirectoryTableRowProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";
import { usePageTransition } from "@/shared/providers/pageTransitionContext";

/**
 * Clickable directory listing row — whole row opens `to` (or `onActivate`),
 * with hover + pointer. Use `stopDirectoryRowNav` on action buttons and links.
 */
export const DirectoryTableRow = forwardRef<
  HTMLDivElement,
  DirectoryTableRowProps & { style?: CSSProperties }
>(function DirectoryTableRow(
  { to, onActivate, className, children, style },
  ref,
) {
  const { navigateWithTransition } = usePageTransition();

  const go = () => {
    if (to) {
      navigateWithTransition(to);
      return;
    }
    onActivate?.();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      go();
    }
  };

  return (
    <div
      ref={ref}
      data-slot="directory-row"
      role={to ? "link" : "button"}
      tabIndex={0}
      style={style}
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted/50",
        className,
      )}
      onClick={go}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
});
