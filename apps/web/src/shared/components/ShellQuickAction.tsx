import { Link } from "react-router";

import { DayflowImage } from "@/shared/components/DayflowImage";
import type { ShellQuickActionProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

/** Hidden on short windows so the nav always fits. Title leads; art and CTA follow. */
export function ShellQuickAction({
  action,
  onNavigate,
}: ShellQuickActionProps) {
  return (
    <section className="rounded-xl border border-sidebar-border bg-sidebar px-3 pt-3 pb-3 text-center text-sidebar-accent-foreground [@media(max-height:760px)]:hidden">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-sidebar-foreground/55 uppercase">
        {action.title}
      </p>
      <DayflowImage
        name={action.image}
        className="mx-auto mt-2.5 h-[4.5rem] w-auto"
      />
      {action.description ? (
        <p className="mt-2 text-xs leading-snug text-sidebar-foreground/70 text-pretty">
          {action.description}
        </p>
      ) : null}
      <Button asChild variant="outline" size="sm" className="mt-3 h-9 w-full">
        <Link to={action.buttonTo} onClick={onNavigate}>
          {action.buttonLabel}
        </Link>
      </Button>
    </section>
  );
}
