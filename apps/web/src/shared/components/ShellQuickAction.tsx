import { Link } from "react-router";

import { DayflowImage } from "@/shared/components/DayflowImage";
import type { ShellQuickActionProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

/** Hidden on short windows so the nav and profile row always fit. */
export function ShellQuickAction({ action, onNavigate }: ShellQuickActionProps) {
  return (
    <section className="rounded-xl border border-sidebar-border bg-sidebar-accent p-3 text-sidebar-accent-foreground [@media(max-height:760px)]:hidden">
      <DayflowImage name={action.image} className="mx-auto mb-2 h-20 w-auto" />
      <h2 className="text-base leading-tight">{action.title}</h2>
      <p className="mt-1 text-xs leading-snug text-sidebar-accent-foreground/85">{action.description}</p>
      <Button asChild size="sm" className="mt-3 h-9 w-full">
        <Link to={action.buttonTo} onClick={onNavigate}>
          {action.buttonLabel}
        </Link>
      </Button>
    </section>
  );
}
