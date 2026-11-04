import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import type { PanelLinkProps } from "@/shared/types/components";

/** Sits in a panel's heading and goes to the page behind its numbers. */
export function PanelLink({ to, children }: PanelLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-sm text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {children}
      <ArrowUpRight className="size-4" aria-hidden="true" />
    </Link>
  );
}
