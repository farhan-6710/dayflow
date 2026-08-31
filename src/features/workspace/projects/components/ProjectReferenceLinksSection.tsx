import { useState } from "react";
import { ExternalLink, Link2, Pencil, Plus, Trash2 } from "lucide-react";

import { ProjectReferenceLinkDialog } from "@/features/workspace/projects/components/ProjectReferenceLinkDialog";
import type { ProjectReferenceLinksSectionProps } from "@/features/workspace/projects/types/components";
import type { CreateProjectReferenceLinkInput } from "@/features/workspace/projects/types/referenceLinks";
import {
  EMPTY_PROJECT_REFERENCE_LINK_FORM,
  projectReferenceLinkToFormValues,
  type ProjectReferenceLinkFormValues,
} from "@/features/workspace/projects/utils/projectReferenceLinkFormUtils";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { Button } from "@/shared/ui/button";

export function ProjectReferenceLinksSection({
  referenceLinks,
  canEdit,
  isSaving = false,
  onAdd,
  onUpdate,
  onDelete,
}: ProjectReferenceLinksSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [values, setValues] = useState<ProjectReferenceLinkFormValues>(
    EMPTY_PROJECT_REFERENCE_LINK_FORM,
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openAttach = () => {
    setEditingLinkId(null);
    setValues(EMPTY_PROJECT_REFERENCE_LINK_FORM);
    setDialogOpen(true);
  };

  const openEdit = (link: (typeof referenceLinks)[number]) => {
    setEditingLinkId(link.id);
    setValues(projectReferenceLinkToFormValues(link));
    setDialogOpen(true);
  };

  const buildPayload = (): CreateProjectReferenceLinkInput => ({
    url: values.url,
    label: values.label.trim() || null,
  });

  const handleSave = async () => {
    try {
      if (editingLinkId) {
        await onUpdate(editingLinkId, buildPayload());
      } else {
        await onAdd(buildPayload());
      }
      setDialogOpen(false);
      setEditingLinkId(null);
    } catch {
      // Caller toasts.
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-5">
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Reference Links
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Links stored with this project.
          </p>
        </div>
        {canEdit ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={isSaving}
            onClick={openAttach}
          >
            <Plus className="mr-1.5 size-3.5" />
            Attach
          </Button>
        ) : null}
      </div>

      <div className="px-6 py-5">
        {referenceLinks.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No reference links
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {referenceLinks.map((link) => (
              <li
                key={link.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <Link2
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
                  >
                    <span className="truncate">
                      {link.label?.trim() || link.url}
                    </span>
                    <ExternalLink className="size-3.5 shrink-0 opacity-60" />
                  </a>
                  {link.label?.trim() ? (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {link.url}
                    </p>
                  ) : null}
                </div>
                {canEdit ? (
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      disabled={isSaving}
                      aria-label="Edit reference link"
                      onClick={() => openEdit(link)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      disabled={isSaving}
                      aria-label="Delete reference link"
                      onClick={() => setPendingDeleteId(link.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ProjectReferenceLinkDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingLinkId(null);
        }}
        isEditing={editingLinkId !== null}
        isSaving={isSaving}
        values={values}
        onFieldChange={(field, value) =>
          setValues((current) => ({ ...current, [field]: value }))
        }
        onSave={() => void handleSave()}
      />

      <ConfirmationModal
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
        title="Delete reference link?"
        description="This removes the link from the project. This cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          if (!pendingDeleteId) return;
          try {
            await onDelete(pendingDeleteId);
            setPendingDeleteId(null);
          } catch {
            // Caller toasts.
          }
        }}
      />
    </div>
  );
}
