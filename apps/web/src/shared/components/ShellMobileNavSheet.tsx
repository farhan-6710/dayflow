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
        className="w-64 max-w-[85vw] gap-0 border-r border-white/70 bg-white/75 p-0 text-sidebar-foreground shadow-2xl backdrop-blur-2xl sm:max-w-xs dark:border-white/10 dark:bg-card/75"
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
