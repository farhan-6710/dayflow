import { Children, isValidElement, type ReactNode } from "react";

import { DayflowImage } from "@/shared/components/DayflowImage";
import { TableLoadingState } from "@/shared/components/LoadingSpinner";
import {
  DIRECTORY_TABLE_MIN_WIDTH_CLASS,
  TABLE_HORIZONTAL_SCROLL_CLASS,
} from "@/shared/constants/directoryTable";
import {
  containMinWidthClassName,
  panelDescriptionClassName,
  panelTitleClassName,
  raisedStaticPanelClassName,
} from "@/shared/constants/layoutStyles";
import type { DirectoryTableProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

function tableBodyKey(
  isLoading: boolean,
  isEmpty: boolean,
  children: ReactNode,
) {
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
  emptyImageSrc,
  headerAside,
  children,
  divided = false,
  gridStyle,
}: DirectoryTableProps) {
  return (
    <div className={cn("animate-enter w-full min-w-0 overflow-hidden", raisedStaticPanelClassName)}>
      <div className="flex flex-col gap-4 px-5 pt-5 pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className={cn("min-w-0", containMinWidthClassName)}>
          <h2 className={panelTitleClassName}>{title}</h2>
          <p className={panelDescriptionClassName}>{description}</p>
        </div>
        {headerAside ? (
          <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-2">
            {headerAside}
          </div>
        ) : null}
      </div>

      <div
        className={cn(TABLE_HORIZONTAL_SCROLL_CLASS, "border-t border-foreground/10")}
      >
        <div className={DIRECTORY_TABLE_MIN_WIDTH_CLASS}>
          <div
            className={cn(
              "grid w-full items-center bg-[color-mix(in_srgb,var(--primary)_8%,var(--card))] px-6 text-xs font-medium tracking-wide text-muted-foreground uppercase max-sm:hidden",
              divided
                ? "items-stretch divide-x divide-foreground/10 border-b border-foreground/10"
                : "gap-4 border-b border-foreground/10 py-3",
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

          {isLoading ? (
            <TableLoadingState />
          ) : (
            <div key={tableBodyKey(false, isEmpty, children)}>
              {isEmpty ? (
                <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                  {emptyImageSrc ? (
                    <DayflowImage src={emptyImageSrc} className="size-20 object-contain" />
                  ) : null}
                  <p className="max-w-sm text-sm text-foreground/75">{emptyMessage}</p>
                </div>
              ) : (
                <div className="[&>[data-slot=directory-row]+[data-slot=directory-row]]:border-t [&>[data-slot=directory-row]+[data-slot=directory-row]]:border-foreground/10">
                  {children}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
