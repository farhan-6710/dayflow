import { Phantom } from "@/shared/components/Phantom";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { TableSkeletonProps } from "@/shared/types/components";

const DEFAULT_CELLS = ["A row title goes here", "Category", "Status"];

/** Placeholder rows. Pass the table's grid and columns so the rows line up with its header. */
export function TableSkeleton({ rows = 5, gridClass, columns, panel = false }: TableSkeletonProps) {
  const cells = columns ? columns.map((column) => column.label) : DEFAULT_CELLS;

  return (
    <Phantom className={cn(panel && panelClassName)}>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }, (_, row) => (
          <div
            key={row}
            className={cn("grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 px-5 py-4", gridClass && ["grid-cols-1", gridClass])}
          >
            {cells.map((cell, index) => (
              <span key={index} className="min-w-0 truncate text-sm">
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Phantom>
  );
}
