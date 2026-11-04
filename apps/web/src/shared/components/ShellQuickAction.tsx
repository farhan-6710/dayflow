import { Zap } from "lucide-react";
import { Link } from "react-router";

import type { ShellQuickActionProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

/** Hidden on short windows so the nav and profile row always fit. Outlined so it never outranks the active nav item. */
export function ShellQuickAction({ action, onNavigate }: ShellQuickActionProps) {
  return (
    <section className="rounded-xl border border-sidebar-border bg-sidebar-accent p-3 text-sidebar-accent-foreground [@media(max-height:620px)]:hidden">
      <h2 className="flex items-center gap-2 text-base leading-tight">
        <Zap className="size-4 text-chart-1" aria-hidden="true" />
        {action.title}
      </h2>
      <Button asChild variant="outline" size="sm" className="mt-2.5 h-9 w-full">
        <Link to={action.buttonTo} onClick={onNavigate}>
          {action.buttonLabel}
        </Link>
      </Button>
    </section>
  );
}
