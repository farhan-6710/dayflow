import { Link } from "react-router";

import { DayflowImage } from "@/shared/components/DayflowImage";
import type { ShellQuickActionProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

/** Hidden on short windows so the nav and profile row always fit. Outlined so it never outranks the active nav item. */
export function ShellQuickAction({ action, onNavigate }: ShellQuickActionProps) {
  return (
    <section className="rounded-xl border border-sidebar-border bg-sidebar-accent p-3 text-sidebar-accent-foreground [@media(max-height:680px)]:hidden">
      <div className="flex items-center gap-2.5">
        <DayflowImage name={action.image} className="h-12 w-auto shrink-0" />
        <h2 className="min-w-0 text-base leading-tight">{action.title}</h2>
      </div>
      <Button asChild variant="outline" size="sm" className="mt-2.5 h-9 w-full">
        <Link to={action.buttonTo} onClick={onNavigate}>
          {action.buttonLabel}
        </Link>
      </Button>
    </section>
  );
}
