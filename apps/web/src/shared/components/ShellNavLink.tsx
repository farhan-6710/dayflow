import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TransitionLink } from "@/shared/components/TransitionLink";
import { shellNavIcons } from "@/shared/constants/shellNavIcons";
import { cn } from "@/shared/lib/utils";
import type { ShellNavItem } from "@/shared/types/components";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { resolveActiveNavPath } from "@/shared/utils/shellNavActive";
import { routePath } from "@/shared/utils/routePath";

/** Mirrors the Trail sidebar menu button: accent wash for hover and the active page. */
const navLinkClass = (isActive: boolean, collapsed: boolean) =>
  cn(
    "flex h-9 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-colors",
    "focus-visible:ring-2 focus-visible:ring-sidebar-ring [&>span:last-child]:truncate",
    collapsed && "mx-auto size-9 justify-center",
    isActive
      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  );

const subLinkClass = (isActive: boolean) =>
  cn(
    "flex h-7 items-center rounded-md px-2 text-sm transition-colors",
    isActive
      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  );

type NavLinkProps = {
  item: ShellNavItem;
  isActive: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
};

export function ShellNavLink({ item, isActive, collapsed, onNavigate }: NavLinkProps) {
  const Icon = shellNavIcons[item.icon];
  const navLinkEl = (
    <TransitionLink to={item.to} onClick={onNavigate} className={navLinkClass(isActive, collapsed)}>
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {collapsed ? <span className="sr-only">{item.label}</span> : <span>{item.label}</span>}
    </TransitionLink>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">{navLinkEl}</div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <p className="font-medium">{item.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return navLinkEl;
}

type NavGroupProps = {
  item: ShellNavItem;
  collapsed: boolean;
  activePath: string;
  onNavigate?: () => void;
};

export function ShellNavGroup({ item, collapsed, activePath, onNavigate }: NavGroupProps) {
  const Icon = shellNavIcons[item.icon];
  const children = item.children ?? [];
  const activeChildPath = resolveActiveNavPath(activePath, children);
  const groupActive = activeChildPath !== null;
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const open = manualOpen ?? groupActive;

  if (collapsed) {
    return <ShellNavLink item={item} isActive={groupActive} collapsed onNavigate={onNavigate} />;
  }

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => setManualOpen(!open)}
        aria-expanded={open}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          groupActive && "font-medium",
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="mx-3.5 flex min-w-0 flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
          {children.map((child) => (
            <TransitionLink
              key={child.to}
              to={child.to}
              onClick={onNavigate}
              className={subLinkClass(routePath(child.to) === activeChildPath)}
            >
              <span className="truncate">{child.label}</span>
            </TransitionLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}
