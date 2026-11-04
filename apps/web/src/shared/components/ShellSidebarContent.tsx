import { Link } from "react-router";
import { PanelLeftClose, PanelRightClose } from "lucide-react";

import { DayFlowLogo } from "@/shared/components/DayFlowLogo";
import { Reveal } from "@/shared/components/Reveal";
import { ShellNavLink } from "@/shared/components/ShellNavLink";
import { ShellQuickAction } from "@/shared/components/ShellQuickAction";
import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { cn } from "@/shared/lib/utils";
import type { ShellSidebarContentProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

export function ShellSidebarContent({
  config,
  collapsed,
  onNavigate,
  onToggleSidebar,
}: ShellSidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Reveal kind="shell-left" className="shrink-0 border-b border-border">
        <div
          className={cn(
            "flex h-[63px] items-center",
            collapsed ? "justify-center" : "justify-center px-3",
          )}
        >
          {collapsed ? (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label={`Expand ${BRAND_NAME} sidebar`}
              className="flex size-10 items-center justify-center rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50"
            >
              <DayFlowLogo className="size-10" />
            </button>
          ) : (
            <Link
              to={config.homeLink}
              onClick={onNavigate}
              aria-label={`${BRAND_NAME} home`}
              className="flex min-w-0 items-center gap-1 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50"
            >
              <DayFlowLogo className="size-10" />
              <span className="min-w-0 leading-none">
                <span className="block truncate text-xl">{BRAND_NAME}</span>
                <span className="-mt-1 block truncate text-[11px] text-sidebar-foreground/70">
                  {config.brandSubtitle}
                </span>
              </span>
            </Link>
          )}
        </div>
      </Reveal>

      <nav
        aria-label="Main"
        className="min-h-0 flex-1 overflow-y-auto px-3 py-3"
      >
        <ul className="grid gap-1">
          {config.nav.map((item) => (
            <Reveal as="li" kind="shell-left" key={item.to}>
              <ShellNavLink
                item={item}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            </Reveal>
          ))}
        </ul>
      </nav>

      <Reveal
        kind="shell-left"
        className="shrink-0 space-y-3 border-t border-border p-3"
      >
        {collapsed ? null : (
          <ShellQuickAction
            action={config.quickAction}
            onNavigate={onNavigate}
          />
        )}
        {onToggleSidebar ? (
          <Button
            type="button"
            variant="outline"
            className={`h-10 w-full gap-3 px-3 ${collapsed ? "justify-center" : "justify-start"}`}
            aria-label="Collapse sidebar"
            aria-expanded
            onClick={onToggleSidebar}
          >
            {collapsed ? (
              <PanelRightClose className="size-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="size-4" aria-hidden="true" />
            )}
            {collapsed ? null : <p>Collapse sidebar</p>}
          </Button>
        ) : null}
      </Reveal>
    </div>
  );
}
