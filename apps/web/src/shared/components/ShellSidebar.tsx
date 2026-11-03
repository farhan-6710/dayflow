import { ShellSidebarContent } from "@/shared/components/ShellSidebarContent";
import { cn } from "@/shared/lib/utils";
import type { ShellSidebarProps } from "@/shared/types/components";

export function ShellSidebar({ config, collapsed }: ShellSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out lg:block",
        collapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <ShellSidebarContent config={config} collapsed={collapsed} />
    </aside>
  );
}
