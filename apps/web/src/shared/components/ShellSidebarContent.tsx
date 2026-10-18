import { motion } from "framer-motion";

import { SidebarBrand } from "@/shared/components/SidebarBrand";
import { ShellSidebarProfile } from "@/shared/components/ShellSidebarProfile";
import { ShellNavGroup, ShellNavLink } from "@/shared/components/ShellNavLink";
import { TransitionLink } from "@/shared/components/TransitionLink";
import { SHELL_NAV_ITEM, SHELL_STAGGER } from "@/shared/constants/pageMotion";
import { cn } from "@/shared/lib/utils";
import { usePageTransition } from "@/shared/providers/pageTransitionContext";
import type { ShellSidebarContentProps } from "@/shared/types/components";
import { resolveActiveNavPath } from "@/shared/utils/shellNavActive";
import { routePath } from "@/shared/utils/routePath";

export function ShellSidebarContent({
  config,
  collapsed,
  onNavigate,
}: ShellSidebarContentProps) {
  const { activePath } = usePageTransition();
  const activeNavPath = resolveActiveNavPath(activePath, config.nav);

  return (
    <motion.div className="flex h-full flex-col" {...SHELL_STAGGER}>
      <motion.div
        variants={SHELL_NAV_ITEM}
        className="shrink-0 border-b border-sidebar-border/50 dark:border-white/5"
      >
        <TransitionLink
          to={config.homeLink}
          onClick={onNavigate}
          className="flex items-center justify-center px-4 py-3"
        >
          <SidebarBrand collapsed={collapsed} subtitle={config.brandSubtitle} />
        </TransitionLink>
      </motion.div>

      <nav className={cn("min-h-0 flex-1 space-y-1.5 overflow-y-auto", collapsed ? "p-3" : "p-4")}>
        {config.nav.map((item) =>
          item.children && item.children.length > 0 ? (
            <motion.div key={item.to} variants={SHELL_NAV_ITEM}>
              <ShellNavGroup
                item={item}
                collapsed={collapsed}
                activePath={activePath}
                onNavigate={onNavigate}
              />
            </motion.div>
          ) : (
            <motion.div key={item.to} variants={SHELL_NAV_ITEM}>
              <ShellNavLink
                item={item}
                isActive={routePath(item.to) === activeNavPath}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            </motion.div>
          ),
        )}
      </nav>

      {!collapsed && config.quickAction ? (
        <motion.div variants={SHELL_NAV_ITEM} className="p-4">
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 backdrop-blur-md dark:border-white/5 dark:bg-white/5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {config.quickAction.title}
            </div>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {config.quickAction.description}
            </p>
            <TransitionLink
              to={config.quickAction.buttonTo}
              onClick={onNavigate}
              className="mt-4 inline-flex w-full items-center justify-center truncate rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-95"
            >
              {config.quickAction.buttonLabel}
            </TransitionLink>
          </div>
        </motion.div>
      ) : null}

      {config.profilePath ? (
        <motion.div variants={SHELL_NAV_ITEM}>
          <ShellSidebarProfile
            to={config.profilePath}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </motion.div>
      ) : null}
    </motion.div>
  );
}
