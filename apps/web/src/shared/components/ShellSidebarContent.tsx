import { Link } from "react-router";

import { DayFlowLogo } from "@/shared/components/DayFlowLogo";
import { Reveal } from "@/shared/components/Reveal";
import { ShellNavLink } from "@/shared/components/ShellNavLink";
import { ShellQuickAction } from "@/shared/components/ShellQuickAction";
import { ShellSidebarProfile } from "@/shared/components/ShellSidebarProfile";
import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { cn } from "@/shared/lib/utils";
import type { ShellSidebarContentProps } from "@/shared/types/components";

export function ShellSidebarContent({ config, collapsed, onNavigate }: ShellSidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Reveal kind="shell-left" className="shrink-0">
      <Link
        to={config.homeLink}
        onClick={onNavigate}
        aria-label={`${BRAND_NAME} home`}
        className={cn(
          "flex h-16 shrink-0 items-center justify-center gap-1 outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50 border-b border-border",
          collapsed ? "justify-center" : "px-4",
        )}
      >
        <DayFlowLogo className="size-10" />
        {collapsed ? null : (
          <span className="min-w-0 leading-none">
            <span className="block truncate text-xl">{BRAND_NAME}</span>
            <span className="-mt-1 block truncate text-[11px] text-sidebar-foreground/70">
              {config.brandSubtitle}
            </span>
          </span>
        )}
      </Link>
      </Reveal>

      <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto px-3 py-3 pt-4">
        <ul className="grid gap-1">
          {config.nav.map((item) => (
            <Reveal as="li" kind="shell-left" key={item.to}>
              <ShellNavLink item={item} collapsed={collapsed} onNavigate={onNavigate} />
            </Reveal>
          ))}
        </ul>
      </nav>

      <Reveal kind="shell-left" className="shrink-0 space-y-3 p-3">
        {collapsed ? null : <ShellQuickAction action={config.quickAction} onNavigate={onNavigate} />}
        <ShellSidebarProfile
          profilePath={config.profilePath}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      </Reveal>
    </div>
  );
}
