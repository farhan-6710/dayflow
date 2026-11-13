import { Menu, X } from "lucide-react";

import type { MenuToggleProps } from "@/features/site/types/components";
import { cn } from "@/shared/lib/utils";

/** Menu and close icons crossfade with a blur. */
export function MenuToggle({ open, onToggle }: MenuToggleProps) {
  const icon = "absolute size-6 transition-all duration-300";
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onToggle}
      className="relative flex size-11 cursor-pointer items-center justify-center rounded-lg text-foreground transition-colors outline-none hover:bg-background focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:hidden"
    >
      <Menu className={cn(icon, open ? "opacity-0 blur-md" : "opacity-100 blur-0")} aria-hidden="true" />
      <X className={cn(icon, open ? "opacity-100 blur-0" : "opacity-0 blur-md")} aria-hidden="true" />
    </button>
  );
}
