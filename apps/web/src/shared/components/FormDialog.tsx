import type { FormDialogProps } from "@/shared/types/components";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

export function FormDialog({
  open,
  title,
  description,
  submitLabel,
  saving,
  canSave,
  onOpenChange,
  onSubmit,
  children,
  footerStart,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <DialogFooter className={footerStart ? "flex-row justify-between sm:justify-between" : undefined}>
            {footerStart}
            <div className="flex flex-row flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" size="lg" disabled={saving} onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <SubmitButton loading={saving} disabled={!canSave}>
                {submitLabel}
              </SubmitButton>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
