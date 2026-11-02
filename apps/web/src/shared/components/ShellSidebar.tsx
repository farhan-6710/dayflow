import { ShellSidebarContent } from "@/shared/components/ShellSidebarContent";
import { cn } from "@/shared/lib/utils";
import type { ShellSidebarProps } from "@/shared/types/components";

export function ShellSidebar({ config, collapsed }: ShellSidebarProps) {
  return (
    <aside
      className={cn(
        "min-h-0 w-0 shrink-0 overflow-hidden bg-sidebar text-sidebar-foreground",
        "transition-[width] duration-200 ease-linear",
        collapsed ? "md:w-[4.5rem]" : "md:w-64",
      )}
    >
      <div className="hidden h-full w-full overflow-hidden! p-2 md:flex md:flex-col">
        <ShellSidebarContent config={config} collapsed={collapsed} />
      </div>
    </aside>
  );
}

export { ShellMobileNavSheet } from "./ShellMobileNavSheet";
export { ShellSidebarContent } from "./ShellSidebarContent";
