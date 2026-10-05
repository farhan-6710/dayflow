import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TransitionLink } from "@/shared/components/TransitionLink";
import { shellNavIcons } from "@/shared/constants/shellNavIcons";
import { cn } from "@/shared/lib/utils";
import type { ShellNavItem } from "@/shared/types/components";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { resolveActiveNavPath } from "@/shared/utils/shellNavActive";
import { routePath } from "@/shared/utils/routePath";

const navLinkClass = (isActive: boolean, collapsed: boolean) =>
  cn(
    "flex items-center rounded-2xl text-sm font-medium transition gap-3",
    collapsed ? "justify-center px-4 py-4" : "px-4 py-2.5",
    isActive
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-sidebar-foreground/75 hover:bg-secondary hover:text-secondary-foreground",
  );

const subLinkClass = (isActive: boolean) =>
  cn(
    "flex items-center rounded-xl px-3 py-2 text-sm transition",
    isActive
      ? "bg-primary font-medium text-primary-foreground shadow-sm"
      : "text-sidebar-foreground/65 hover:bg-secondary/70 hover:text-secondary-foreground",
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
          "flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition",
          open || groupActive
            ? "text-sidebar-foreground"
            : "text-sidebar-foreground/75 hover:bg-secondary hover:text-secondary-foreground",
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
        <div className="relative ml-4 space-y-0.5 border-l border-sidebar-border/70 py-0.5 pl-3">
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
