import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type UnsavedChangesModalProps = {
  open: boolean;
  title: string;
  description: string;
  saveLabel: string;
  loading?: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
  onSave: () => void;
};

export function UnsavedChangesModal({
  open,
  title,
  description,
  saveLabel,
  loading = false,
  onKeepEditing,
  onDiscard,
  onSave,
}: UnsavedChangesModalProps) {
  function handleOpenChange(next: boolean) {
    if (loading) return;
    if (!next) onKeepEditing();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onPointerDownOutside={(event) => {
          if (loading) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (loading) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onKeepEditing}
          >
            Keep editing
          </Button>
          <Button
            type="button"
            variant="destructive-outline"
            disabled={loading}
            onClick={onDiscard}
          >
            Close without saving
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={() => void onSave()}
          >
            {loading ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : null}
            {saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
