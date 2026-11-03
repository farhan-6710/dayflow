import { ShellSidebarContent } from "@/shared/components/ShellSidebarContent";
import type { ShellMobileNavSheetProps } from "@/shared/types/components";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui/sheet";

export function ShellMobileNavSheet({ config, open, onOpenChange, description }: ShellMobileNavSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-72 gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground sm:max-w-72"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">{description}</SheetDescription>
        <ShellSidebarContent config={config} collapsed={false} onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
