import { PanelHeading } from "@/shared/components/PanelHeading";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { DetailsPanelProps } from "@/shared/types/components";

/** Label and value rows in a page's right-hand rail. */
export function DetailsPanel({ icon, title, rows }: DetailsPanelProps) {
  return (
    <Reveal as="section" className={cn(panelClassName, "min-w-0 p-5")}>
      <PanelHeading icon={icon} title={title} />
      <dl className="mt-2 divide-y divide-border text-sm">
        {rows.map(({ icon: RowIcon, label, value }) => (
          <div key={label} className="flex items-center gap-3 py-2.5">
            <dt className="flex w-28 shrink-0 items-center gap-2 text-muted-foreground">
              <RowIcon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </dt>
            <dd className="min-w-0 break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
