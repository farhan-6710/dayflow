import { NavLink, useMatch } from "react-router";

import { shellNavIcons } from "@/shared/constants/shellNavIcons";
import { cn } from "@/shared/lib/utils";
import type { ShellNavLinkProps } from "@/shared/types/components";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

export function ShellNavLink({ item, collapsed, onNavigate }: ShellNavLinkProps) {
  const Icon = shellNavIcons[item.icon];
  // A plain string class: Tooltip's Slot would stringify NavLink's className function.
  const isActive = Boolean(useMatch({ path: item.to, end: false }));

  const link = (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      aria-label={collapsed ? item.label : undefined}
      className={cn(
        "flex h-10 items-center gap-3 rounded-lg text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50",
        collapsed ? "justify-center" : "px-3",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="size-[1.125rem] shrink-0" aria-hidden="true" />
      {collapsed ? null : <span className="truncate">{item.label}</span>}
    </NavLink>
  );

  if (!collapsed) {
    return link;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}
