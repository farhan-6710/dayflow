import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { EmptyState } from "@/shared/components/EmptyState";
import { Reveal } from "@/shared/components/Reveal";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { LIST_PAGE_SIZE } from "@/shared/hooks/usePagination";
import { cn } from "@/shared/lib/utils";
import type { DirectoryTableColumn, DirectoryTableProps } from "@/shared/types/components";

function ColumnLabel({ column }: { column: DirectoryTableColumn }) {
  if (!column.onSort) {
    return column.label;
  }
  const Icon = column.sortDirection === "asc" ? ArrowUp : column.sortDirection === "desc" ? ArrowDown : ChevronsUpDown;
  return (
    <button
      type="button"
      onClick={column.onSort}
      className="inline-flex min-h-6 items-center gap-1.5 rounded-sm outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {column.label}
      <Icon className="size-3.5" aria-hidden="true" />
    </button>
  );
}

/** List screen: grid table from `md` up. Below that the column header hides and rows stack as cards. */
export function DirectoryTable({
  title,
  description,
  gridClass,
  columns,
  isLoading = false,
  loadingRows = LIST_PAGE_SIZE,
  isEmpty,
  emptyTitle,
  emptyDescription,
  emptyImage,
  emptyAction,
  action,
  headerAside,
  footer,
  children,
}: DirectoryTableProps) {
  return (
    <Reveal as="section" className={cn(panelClassName, "grid min-w-0 gap-4 overflow-hidden p-4 sm:p-5")}>
      {title || action ? (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {typeof title === "string" ? <h2 className="text-xl">{title}</h2> : title}
            {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {headerAside}

      <div className="min-w-0">
        {isEmpty && !isLoading ? null : (
          <div
            className={cn(
              "hidden items-center gap-4 rounded-lg bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground md:grid",
              gridClass,
            )}
          >
            {columns.map((column, index) => (
              <div
                key={index}
                className={cn(column.align === "right" && "text-right", column.align === "center" && "text-center", column.className)}
              >
                <ColumnLabel column={column} />
              </div>
            ))}
          </div>
        )}

        {isLoading ? (
          <TableSkeleton rows={loadingRows} gridClass={gridClass} columns={columns} />
        ) : isEmpty ? (
          <EmptyState bare title={emptyTitle} description={emptyDescription} image={emptyImage} action={emptyAction} />
        ) : (
          <div className="divide-y divide-border border-b border-border">{children}</div>
        )}
        {isLoading || isEmpty ? null : footer}
      </div>
    </Reveal>
  );
}
