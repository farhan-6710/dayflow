import { ShellSidebarContent } from "@/shared/components/ShellSidebarContent";
import type { ShellMobileNavSheetProps } from "@/shared/types/components";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui/sheet";
import { TooltipProvider } from "@/shared/ui/tooltip";

export function ShellMobileNavSheet({
  config,
  open,
  onOpenChange,
  sheetDescription,
}: ShellMobileNavSheetProps) {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-64 max-w-[85vw] gap-0 bg-sidebar p-0 text-sidebar-foreground sm:max-w-xs"
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <SheetDescription className="sr-only">
          {sheetDescription}
        </SheetDescription>
        <TooltipProvider>
          <ShellSidebarContent config={config} collapsed={false} onNavigate={close} />
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}
