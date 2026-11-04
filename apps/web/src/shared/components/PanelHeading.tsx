import type { PanelHeadingProps } from "@/shared/types/components";

/** A panel's icon and title, with an optional action opposite. */
export function PanelHeading({ icon: Icon, title, action }: PanelHeadingProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="flex min-w-0 items-center gap-2.5 text-xl">
        <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        {title}
      </h2>
      {action}
    </div>
  );
}
