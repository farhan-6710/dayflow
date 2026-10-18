import { motion } from "framer-motion";
import { ShellSidebarContent } from "@/shared/components/ShellSidebarContent";
import { glassPanelClassName } from "@/shared/constants/layoutStyles";
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
        <div
          className={cn(
            "hidden h-full w-full overflow-hidden! md:flex md:flex-col",
            glassPanelClassName,
          )}
        >
          <ShellSidebarContent config={config} collapsed={collapsed} />
        </div>
      </MotionAside>
    </TooltipProvider>
  );
}

export { ShellMobileNavSheet } from "./ShellMobileNavSheet";
export { ShellSidebarContent } from "./ShellSidebarContent";
