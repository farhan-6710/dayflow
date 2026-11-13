import { NavLink } from "react-router";

import { SITE_HOME_PATH } from "@/app/constants/siteRoutes";
import { SITE_NAV_LINKS } from "@/features/site/constants/siteNav";
import type { HeaderNavLinksProps } from "@/features/site/types/components";
import { cn } from "@/shared/lib/utils";

function linkClass(mobile: boolean, active: boolean) {
  return cn(
    "relative rounded-md outline-none transition-colors duration-300 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
    mobile ? "block px-3 py-2.5 hover:bg-background" : "py-2 text-[0.95rem]",
    !mobile &&
      "after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:rounded-full after:bg-chart-1 after:transition-[width] after:duration-300 hover:after:w-full",
    active ? "text-foreground after:w-full" : "text-muted-foreground after:w-0",
    mobile && active && "bg-background",
  );
}

/** Main site links with the coral active underline (desktop) or a stacked list (mobile). */
export function HeaderNavLinks({ mobile = false, onNavigate }: HeaderNavLinksProps) {
  return (
    <ul className={cn("m-0 list-none p-0", mobile ? "flex flex-col gap-1" : "flex items-center gap-6")}>
      {SITE_NAV_LINKS.map(({ label, to }) => (
        <li key={to}>
          <NavLink to={to} end={to === SITE_HOME_PATH} onClick={onNavigate} className={({ isActive }) => linkClass(mobile, isActive)}>
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
