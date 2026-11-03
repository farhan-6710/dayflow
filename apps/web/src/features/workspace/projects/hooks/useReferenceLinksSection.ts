import { useState } from "react";

import type {
  ReferenceLinkInput,
  ReferenceLinksSectionProps,
} from "@/features/workspace/projects/types/components";
import type { ReferenceLink } from "@/shared/types/types";
import { showToast } from "@/shared/utils/showToast";

export function useReferenceLinksSection<T extends ReferenceLink>({ api, onLinksChange }: ReferenceLinksSectionProps<T>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<T | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openAdd() {
    setEditingLink(null);
    setDialogOpen(true);
  }

  function openEdit(link: T) {
    setEditingLink(link);
    setDialogOpen(true);
  }

  /** Throws on failure so the dialog stays open. */
  async function save(input: ReferenceLinkInput) {
    try {
      if (editingLink) {
        const updated = await api.update(editingLink.id, input);
        onLinksChange((links) => links.map((link) => (link.id === updated.id ? updated : link)));
        showToast("success", "Link updated.");
      } else {
        const created = await api.create(input);
        onLinksChange((links) => [created, ...links]);
        showToast("success", "Link added.");
      }
    } catch (error) {
      console.error("Failed to save link:", error);
      showToast("error", "Couldn't save the link. Please try again.");
      throw error;
    }
  }

  async function confirmDelete() {
    if (!linkToDelete) {
      return;
    }
    setDeleting(true);
    try {
      await api.remove(linkToDelete.id);
      onLinksChange((links) => links.filter((link) => link.id !== linkToDelete.id));
      setLinkToDelete(null);
      showToast("success", "Link deleted.");
    } catch (error) {
      console.error("Failed to delete link:", error);
      showToast("error", "Couldn't delete the link. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return {
    dialogOpen,
    setDialogOpen,
    editingLink,
    linkToDelete,
    setLinkToDelete,
    deleting,
    openAdd,
    openEdit,
    save,
    confirmDelete,
  };
}
