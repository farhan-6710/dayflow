import { useState, type FormEvent } from "react";

import type { ReferenceLinkDialogProps } from "@/features/workspace/projects/types/components";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { TextField } from "@/shared/components/TextField";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useUnsavedDialogClose } from "@/shared/unsaved-changes/useUnsavedDialogClose";
import { safeExternalHref } from "@/shared/utils/safeExternalHref";
import { showToast } from "@/shared/utils/showToast";

export function ReferenceLinkDialog({ open, onOpenChange, link, ownerLabel, onSave }: ReferenceLinkDialogProps) {
  const initialLabel = link?.label ?? "";
  const initialUrl = link?.url ?? "";
  const [label, setLabel] = useState(initialLabel);
  const [url, setUrl] = useState(initialUrl);
  const [saving, setSaving] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setLabel(initialLabel);
      setUrl(initialUrl);
    }
  }

  /** Throws on failure so the dialog and the unsaved-changes modal stay open. */
  async function save() {
    if (!safeExternalHref(url)) {
      showToast("error", "Enter a valid web address.");
      throw new Error("Invalid link URL.");
    }
    setSaving(true);
    try {
      await onSave({ url: url.trim(), label: label.trim() || null });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  const { handleOpenChange } = useUnsavedDialogClose({
    id: "reference-link-dialog",
    open,
    isDirty: label !== initialLabel || url !== initialUrl,
    isCreate: !link,
    onOpenChange,
    onSave: save,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save().catch(() => undefined);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">{link ? "Edit link" : "Add link"}</DialogTitle>
          <DialogDescription>Keep a doc, ticket or article with this {ownerLabel}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            id="reference-link-label"
            label="Name (optional)"
            placeholder="e.g. Proposal PDF"
            value={label}
            onChange={setLabel}
            disabled={saving}
          />
          <TextField
            id="reference-link-url"
            label="Web address"
            inputMode="url"
            placeholder="https://"
            value={url}
            onChange={setUrl}
            disabled={saving}
            required
          />
          <DialogFooter>
            <Button type="button" variant="outline" size="lg" disabled={saving} onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <SubmitButton loading={saving} disabled={!url.trim()}>
              {link ? "Save link" : "Add link"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
