import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { TablePaginationProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

export function TablePagination({ pagination, noun }: TablePaginationProps) {
  const { page, totalPages, total, rangeStart, rangeEnd, setPage } = pagination;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
      <p className="text-sm text-muted-foreground tabular-nums">
        Showing {rangeStart}–{rangeEnd} of {total} {total === 1 ? noun.slice(0, -1) : noun}
      </p>
      {totalPages > 1 ? (
        <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
          <Button variant="outline" size="icon-lg" aria-label="Previous page" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft aria-hidden="true" />
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <Button
              key={number}
              variant="ghost"
              size="icon-lg"
              aria-label={`Page ${number}`}
              aria-current={number === page ? "page" : undefined}
              className={cn("font-normal tabular-nums", number === page && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
              onClick={() => setPage(number)}
            >
              {number}
            </Button>
          ))}
          <Button variant="outline" size="icon-lg" aria-label="Next page" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight aria-hidden="true" />
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
