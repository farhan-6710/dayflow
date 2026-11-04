import { Phantom } from "@/shared/components/Phantom";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { TableSkeletonProps } from "@/shared/types/components";

const DEFAULT_CELLS = ["A row title goes here", "Category", "Status"];

/**
 * Placeholder rows shaped like the real ones. `cells` is one row's text, with an array for stacked
 * lines. Pass a table's grid and columns instead so the rows line up with its header.
 */
export function TableSkeleton({ rows = 5, gridClass, columns, cells, flush = false, panel = false, title }: TableSkeletonProps) {
  const rowCells = cells ?? columns?.map((column) => column.label) ?? DEFAULT_CELLS;
  const list = (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }, (_, row) => (
        <div
          key={row}
          style={gridClass ? undefined : { gridTemplateColumns: `minmax(0,1fr) repeat(${rowCells.length - 1},auto)` }}
          className={cn("grid items-center gap-4 py-3.5", !flush && !panel && "px-5", gridClass && ["grid-cols-1", gridClass])}
        >
          {rowCells.map((cell, index) => (
            <div key={index} className="grid min-w-0 justify-items-start gap-1 text-sm">
              {(Array.isArray(cell) ? cell : [cell]).map((line) => (
                <span key={line} className="max-w-full truncate">
                  {line}
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <Phantom>
      {panel ? (
        <section className={cn(panelClassName, "min-w-0 p-5")}>
          {title ? <h2 className="mb-2 text-xl">{title}</h2> : null}
          {list}
        </section>
      ) : (
        list
      )}
    </Phantom>
  );
}
