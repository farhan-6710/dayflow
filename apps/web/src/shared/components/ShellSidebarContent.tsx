import { Link } from "react-router";

import { DayFlowLogo } from "@/shared/components/DayFlowLogo";
import { ShellNavLink } from "@/shared/components/ShellNavLink";
import { ShellQuickAction } from "@/shared/components/ShellQuickAction";
import { ShellSidebarProfile } from "@/shared/components/ShellSidebarProfile";
import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { cn } from "@/shared/lib/utils";
import type { ShellSidebarContentProps } from "@/shared/types/components";

export function ShellSidebarContent({ config, collapsed, onNavigate }: ShellSidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        to={config.homeLink}
        onClick={onNavigate}
        aria-label={`${BRAND_NAME} home`}
        className={cn(
          "flex h-16 shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50",
          collapsed ? "justify-center" : "px-4",
        )}
      >
        <DayFlowLogo className="size-10" />
        {collapsed ? null : (
          <span className="min-w-0 leading-none">
            <span className="block truncate text-xl">{BRAND_NAME}</span>
            <span className="mt-1 block truncate text-xs text-sidebar-foreground/70">
              {config.brandSubtitle}
            </span>
          </span>
        )}
      </Link>

      <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <ul className="grid gap-1">
          {config.nav.map((item) => (
            <li key={item.to}>
              <ShellNavLink item={item} collapsed={collapsed} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 space-y-3 p-3">
        {collapsed ? null : <ShellQuickAction action={config.quickAction} onNavigate={onNavigate} />}
        <ShellSidebarProfile
          profilePath={config.profilePath}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}
