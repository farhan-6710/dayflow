import { ChevronRight, Home } from "lucide-react";
import { useContext } from "react";
import { Link, useLocation } from "react-router";

import { BreadcrumbTrailContext } from "@/shared/hooks/usePageBreadcrumbs";
import { cn } from "@/shared/lib/utils";
import type { BreadcrumbsProps } from "@/shared/types/components";

const LINK_CLASS = "rounded-sm outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50";

/** Home, then the section from the nav, then any steps the page adds. The last one is the current page. */
export function Breadcrumbs({ nav, homeLink, className }: BreadcrumbsProps) {
  const { pathname } = useLocation();
  const { trail } = useContext(BreadcrumbTrailContext);
  const section = nav.find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`));
  const items = [...(section ? [{ label: section.label, to: section.to }] : []), ...trail];

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
        <li className="shrink-0">
          <Link to={homeLink} aria-label="Home" className={cn(LINK_CLASS, "flex size-6 items-center justify-center")}>
            <Home className="size-4" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className={cn("flex items-center gap-1.5", isLast ? "min-w-0" : "min-w-0 shrink-[2]")}>
              <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
              {isLast || !item.to ? (
                <span aria-current={isLast ? "page" : undefined} className={cn("truncate", isLast && "text-foreground")}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className={cn(LINK_CLASS, "truncate")}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
