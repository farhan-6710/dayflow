import { EmptyState } from "@/shared/components/EmptyState";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { Reveal } from "@/shared/components/Reveal";
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
  action,
  headerAside,
  children,
}: DirectoryTableProps) {
  return (
    <Reveal as="section" className={cn(panelClassName, "min-w-0 overflow-hidden")}>
      {title || action ? (
        <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="min-w-0">
            {title ? <h2 className="text-xl">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {headerAside ? <div className="px-4 py-4 sm:px-5">{headerAside}</div> : title || action ? <div className="h-4" /> : null}

      {isEmpty && !isLoading ? null : (
        <div
          className={cn(
            "hidden items-center gap-4 border-y border-border bg-muted/40 px-5 py-2.5 text-xs text-muted-foreground md:grid",
            gridClass,
          )}
        >
          {columns.map((column, index) => (
            <div key={index} className={cn(column.align === "right" && "text-right", column.align === "center" && "text-center", column.className)}>
              {column.label}
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <TableSkeleton gridClass={gridClass} columns={columns} />
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
    </Reveal>
  );
}
