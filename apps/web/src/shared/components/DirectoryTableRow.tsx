import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router";

import { cn } from "@/shared/lib/utils";
import type { DirectoryTableRowProps } from "@/shared/types/components";

/**
 * The whole row opens `to` (or runs `onActivate`). Use `stopDirectoryRowNav`
 * on action buttons and links inside it.
 */
export function DirectoryTableRow({ to, onActivate, label, className, children }: DirectoryTableRowProps) {
  const navigate = useNavigate();

  function activate() {
    if (to) {
      void navigate(to);
    } else {
      onActivate?.();
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // Only when the row itself has focus, so nested buttons keep their own keys.
    if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      activate();
    }
  }

  return (
    <div
      role={to ? "link" : "button"}
      tabIndex={0}
      aria-label={label}
      onClick={activate}
      onKeyDown={onKeyDown}
      className={cn(
        "cursor-pointer px-5 py-3.5 transition-colors outline-none hover:bg-accent focus-visible:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset",
        className,
      )}
    >
      {children}
    </div>
  );
}
