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
import type { UnsavedChangesModalProps } from "@/shared/unsaved-changes/types";

export function UnsavedChangesModal({
  open,
  title,
  description,
  saveLabel,
  loading,
  onKeepEditing,
  onDiscard,
  onSave,
}: UnsavedChangesModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && !loading && onKeepEditing()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-normal">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" size="lg" disabled={loading} onClick={onKeepEditing}>
            Keep editing
          </Button>
          <Button
            variant="ghost"
            size="lg"
            disabled={loading}
            onClick={onDiscard}
          >
            Close without saving
          </Button>
          <Button size="lg" disabled={loading} onClick={onSave}>
            {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            {saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
