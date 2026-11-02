import { ArrowRight } from "lucide-react";

import { DayflowImage } from "@/shared/components/DayflowImage";
import { SidebarBrand } from "@/shared/components/SidebarBrand";
import { ShellSidebarProfile } from "@/shared/components/ShellSidebarProfile";
import { ShellNavGroup, ShellNavLink } from "@/shared/components/ShellNavLink";
import { TransitionLink } from "@/shared/components/TransitionLink";
import { DAYFLOW_IMAGES } from "@/shared/constants/dayflowImages";
import { cn } from "@/shared/lib/utils";
import { usePageTransition } from "@/shared/providers/pageTransitionContext";
import { useTheme } from "@/shared/providers/ThemeProvider";
import type { ShellSidebarContentProps } from "@/shared/types/components";
import { resolveActiveNavPath } from "@/shared/utils/shellNavActive";
import { routePath } from "@/shared/utils/routePath";

export function ShellSidebarContent({
  config,
  collapsed,
  onNavigate,
}: ShellSidebarContentProps) {
  const { activePath } = usePageTransition();
  const { isDarkMode } = useTheme();
  const activeNavPath = resolveActiveNavPath(activePath, config.nav);
  const flowSrc = isDarkMode
    ? DAYFLOW_IMAGES.sidebarFlowDark
    : DAYFLOW_IMAGES.sidebarFlowLight;

  return (
    <div className="flex h-full flex-col">
      <div className="animate-shell-left shrink-0 p-2 py-3">
        <TransitionLink
          to={config.homeLink}
          onClick={onNavigate}
          aria-label="Go to dashboard"
          className="flex justify-center rounded-lg px-1 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <SidebarBrand collapsed={collapsed} subtitle={config.brandSubtitle} />
        </TransitionLink>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto">
        <nav className="relative flex w-full min-w-0 flex-col p-2" aria-label="Main navigation">
          {!collapsed && config.brandSubtitle ? (
            <div className="animate-shell-left flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70">
              {config.brandSubtitle}
            </div>
          ) : null}
          <ul className="flex w-full min-w-0 flex-col gap-0">
            {config.nav.map((item) => (
              <li key={item.to} className="animate-shell-left relative">
                {item.children && item.children.length > 0 ? (
                  <ShellNavGroup
                    item={item}
                    collapsed={collapsed}
                    activePath={activePath}
                    onNavigate={onNavigate}
                  />
                ) : (
                  <ShellNavLink
                    item={item}
                    isActive={routePath(item.to) === activeNavPath}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        {!collapsed ? (
          <div className="mt-auto flex w-full min-w-0 flex-col gap-3 p-2">
            <DayflowImage
              src={flowSrc}
              alt=""
              className="animate-shell-left mx-auto w-[9.5rem] select-none"
              fallback={null}
            />
            {config.quickAction ? (
              <TransitionLink
                to={config.quickAction.buttonTo}
                onClick={onNavigate}
                className="animate-shell-left group/card block rounded-xl border bg-card p-3 shadow-xs transition-all hover:-translate-y-px hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="truncate">{config.quickAction.title}</span>
                  <ArrowRight
                    className="size-3.5 shrink-0 transition-transform group-hover/card:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1.5 line-clamp-2 block text-sm leading-snug font-medium">
                  {config.quickAction.description}
                </span>
                <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-foreground">
                  {config.quickAction.buttonLabel}
                </span>
              </TransitionLink>
            ) : null}
          </div>
        ) : null}
      </div>

      {config.profilePath ? (
        <div className={cn("animate-shell-left shrink-0 p-2", collapsed && "flex justify-center")}>
          <ShellSidebarProfile
            to={config.profilePath}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </div>
      ) : null}
    </div>
  );
}
