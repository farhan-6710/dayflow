import { motion } from "framer-motion";

import { DayflowImage } from "@/shared/components/DayflowImage";
import { SidebarBrand } from "@/shared/components/SidebarBrand";
import { ShellSidebarProfile } from "@/shared/components/ShellSidebarProfile";
import { ShellNavGroup, ShellNavLink } from "@/shared/components/ShellNavLink";
import { TransitionLink } from "@/shared/components/TransitionLink";
import { DAYFLOW_IMAGES } from "@/shared/constants/dayflowImages";
import { SHELL_NAV_ITEM, SHELL_STAGGER } from "@/shared/constants/pageMotion";
import { cn } from "@/shared/lib/utils";
import { usePageTransition } from "@/shared/providers/pageTransitionContext";
import { useTheme } from "@/shared/providers/ThemeProvider";
import type { ShellSidebarContentProps } from "@/shared/types/components";
import { resolveActiveNavPath } from "@/shared/utils/shellNavActive";
import { routePath } from "@/shared/utils/routePath";
import { buttonVariants } from "@/shared/utils/shadcn";

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

      <nav
        className={cn(
          "min-h-0 flex-1 space-y-1.5 overflow-y-auto",
          collapsed ? "p-3" : "p-4",
        )}
      >
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

      {!collapsed ? (
        <motion.div
          variants={SHELL_NAV_ITEM}
          className="flex shrink-0 justify-center px-4 pb-1 pt-2"
          aria-hidden
        >
          <DayflowImage
            src={flowSrc}
            alt=""
            className="h-24 w-auto select-none drop-shadow-md"
            fallback={null}
          />
        </motion.div>
      ) : null}

      {!collapsed && config.quickAction ? (
        <motion.div variants={SHELL_NAV_ITEM} className="p-4 pt-2">
          <div className="surface-inset rounded-2xl border border-border/60 bg-muted/30 p-4 backdrop-blur-md dark:border-white/5 dark:bg-white/5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {config.quickAction.title}
            </div>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {config.quickAction.description}
            </p>
            <TransitionLink
              to={config.quickAction.buttonTo}
              onClick={onNavigate}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "mt-4 w-full truncate",
              )}
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
