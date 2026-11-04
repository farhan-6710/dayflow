import { ArrowLeft, ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router";

import type { BreadcrumbsProps } from "@/shared/types/components";

const LINK_CLASS = "rounded-sm outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50";

/** Trail above a page heading. The last item is the current page. `back` adds an arrow for detail pages. */
export function Breadcrumbs({ items, back = false }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
      {back ? <ArrowLeft className="size-4 shrink-0" aria-hidden="true" /> : null}
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 ? <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" /> : null}
          {item.to ? (
            <Link to={item.to} className={LINK_CLASS}>
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="min-w-0 truncate text-foreground">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
