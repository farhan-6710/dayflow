import { EmptyState } from "@/shared/components/EmptyState";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { DirectoryTableProps } from "@/shared/types/components";

/** List screen: grid table from `md` up. Below that the column header hides and rows stack as cards. */
export function DirectoryTable({
  title,
  description,
  gridClass,
  columns,
  isLoading = false,
  isEmpty,
  emptyTitle,
  emptyDescription,
  emptyImage,
  emptyAction,
  headerAside,
  children,
}: DirectoryTableProps) {
  return (
    <section className={cn(panelClassName, "min-w-0 overflow-hidden")}>
      {title || headerAside ? (
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title ? <h2 className="text-xl">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {headerAside ? <div className="flex min-w-0 flex-wrap items-center gap-2">{headerAside}</div> : null}
        </div>
      ) : null}

      {isEmpty && !isLoading ? null : (
        <div
          className={cn(
            "hidden items-center gap-4 border-y border-border bg-muted/40 px-5 py-2.5 text-xs text-muted-foreground md:grid",
            gridClass,
          )}
        >
          {columns.map((column) => (
            <div key={column.label} className={cn(column.align === "right" && "text-right")}>
              {column.label}
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <TableSkeleton />
      ) : isEmpty ? (
        <EmptyState
          bare
          title={emptyTitle}
          description={emptyDescription}
          image={emptyImage}
          action={emptyAction}
        />
      ) : (
        <div className="divide-y divide-border">{children}</div>
      )}
    </section>
  );
}
