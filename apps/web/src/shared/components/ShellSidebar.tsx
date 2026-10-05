import { motion } from "framer-motion";
import { ShellSidebarContent } from "@/shared/components/ShellSidebarContent";
import { SHELL_SIDEBAR_MOTION } from "@/shared/constants/pageMotion";
import { cn } from "@/shared/lib/utils";
import type { ShellSidebarProps } from "@/shared/types/components";
import { TooltipProvider } from "@/shared/ui/tooltip";

const MotionAside = motion.aside;

export function ShellSidebar({ config, collapsed }: ShellSidebarProps) {
  return (
    <TooltipProvider>
      <MotionAside
        {...SHELL_SIDEBAR_MOTION}
        className={cn(
          "min-h-0 w-0 shrink-0 overflow-hidden border-0 bg-transparent text-sidebar-foreground",
          "transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          collapsed ? "md:w-20" : "md:w-64",
        )}
      >
        <div className="hidden h-full w-full overflow-hidden rounded-2xl border border-white/70 bg-white/60 shadow-[0_8px_32px_0_rgba(15,23,42,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl backdrop-saturate-150 md:flex md:flex-col dark:border-white/10 dark:bg-card/50 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.06)]">
          <ShellSidebarContent config={config} collapsed={collapsed} />
        </div>
      </MotionAside>
    </TooltipProvider>
  );
}

export { ShellMobileNavSheet } from "./ShellMobileNavSheet";
export { ShellSidebarContent } from "./ShellSidebarContent";
