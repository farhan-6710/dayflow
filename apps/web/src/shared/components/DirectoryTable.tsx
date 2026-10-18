import { Children, isValidElement, type ReactNode } from "react";

import { FluidReveal } from "@/shared/components/FluidReveal";
import { TableLoadingState } from "@/shared/components/LoadingSpinner";
import {
  DIRECTORY_TABLE_MIN_WIDTH_CLASS,
  TABLE_HORIZONTAL_SCROLL_CLASS,
} from "@/shared/constants/directoryTable";
import {
  containMinWidthClassName,
  glassPanelClassName,
} from "@/shared/constants/layoutStyles";
import type { DirectoryTableProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

function tableBodyKey(isLoading: boolean, isEmpty: boolean, children: ReactNode) {
  if (isLoading) return "loading";
  if (isEmpty) return "empty";
  const keys = Children.map(children, (child) =>
    isValidElement(child) ? String(child.key) : "",
  );
  return keys?.join(":") || "rows";
}

export function DirectoryTable({
  title,
  description,
  gridClass,
  columns,
  isLoading,
  isEmpty,
  emptyMessage,
  headerAside,
  children,
  divided = false,
  gridStyle,
}: DirectoryTableProps) {
  return (
    <div className={cn("w-full min-w-0", glassPanelClassName)}>
      <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className={cn("min-w-0", containMinWidthClassName)}>
          <div className="text-sm font-semibold">{title}</div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        {headerAside ? (
          <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-2">
            {headerAside}
          </div>
        ) : null}
      </div>

      <div
        className={cn(TABLE_HORIZONTAL_SCROLL_CLASS, "border-t border-border")}
      >
        <div className={DIRECTORY_TABLE_MIN_WIDTH_CLASS}>
          <div
            className={cn(
              "grid w-full items-center text-xs font-semibold tracking-wider text-muted-foreground max-sm:hidden bg-muted px-6",
              divided
                ? "items-stretch divide-x divide-border border-b border-border"
                : "gap-4 py-3",
              gridClass,
            )}
            style={gridStyle}
          >
            {columns.map((column, index) => (
              <div
                key={column.label}
                className={cn(
                  column.align === "right" ? "text-right" : undefined,
                  divided
                    ? cn("py-3 pr-4 relative", index === 0 ? "pl-0" : "pl-4")
                    : undefined,
                )}
              >
                {column.label}
              </div>
            ))}
          </div>

          <FluidReveal motionKey={tableBodyKey(isLoading, isEmpty, children)}>
            {isLoading ? (
              <TableLoadingState />
            ) : isEmpty ? (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              <div className="divide-y divide-border">{children}</div>
            )}
          </FluidReveal>
        </div>
      </div>
    </div>
  );
}
