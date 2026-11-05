import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { TablePaginationProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

/** 32px to look at, with the tap area stretched to the 40px minimum. The nav's gap keeps neighbours from overlapping. */
const BUTTON_CLASS = "relative after:absolute after:-inset-1";

export function TablePagination({ pagination, noun }: TablePaginationProps) {
  const { page, totalPages, total, rangeStart, rangeEnd, setPage } = pagination;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
      <p className="text-sm text-muted-foreground tabular-nums">
        Showing {rangeStart}–{rangeEnd} of {total} {total === 1 ? noun.slice(0, -1) : noun}
      </p>
      {totalPages > 1 ? (
        <nav aria-label="Pagination" className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon-sm" className={BUTTON_CLASS} aria-label="Previous page" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft aria-hidden="true" />
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <Button
              key={number}
              variant={number === page ? "default" : "outline"}
              size="icon-sm"
              aria-label={`Page ${number}`}
              aria-current={number === page ? "page" : undefined}
              className={cn(BUTTON_CLASS, "font-normal tabular-nums")}
              onClick={() => setPage(number)}
            >
              {number}
            </Button>
          ))}
          <Button variant="outline" size="icon-sm" className={BUTTON_CLASS} aria-label="Next page" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight aria-hidden="true" />
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
