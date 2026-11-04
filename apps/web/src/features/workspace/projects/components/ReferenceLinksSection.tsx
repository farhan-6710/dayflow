import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";

import { ReferenceLinkDialog } from "@/features/workspace/projects/components/ReferenceLinkDialog";
import { useReferenceLinksSection } from "@/features/workspace/projects/hooks/useReferenceLinksSection";
import type { ReferenceLinksSectionProps } from "@/features/workspace/projects/types/components";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { ReferenceLink } from "@/shared/types/types";
import { Button } from "@/shared/ui/button";
import { safeExternalHref } from "@/shared/utils/safeExternalHref";

export function ReferenceLinksSection<T extends ReferenceLink>(props: ReferenceLinksSectionProps<T>) {
  const { links, canEdit, ownerLabel } = props;
  const section = useReferenceLinksSection(props);

  return (
    <Reveal as="section" className={cn(panelClassName, "min-w-0 p-5")}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl">Reference links</h2>
        {canEdit ? (
          <Button variant="outline" onClick={section.openAdd} className="h-10">
            <Plus aria-hidden="true" />
            Add
          </Button>
        ) : null}
      </div>

      {links.length === 0 ? (
        <EmptyState
          bare
          className="px-2 py-6"
          image="icon-empty-links"
          title="No links yet"
          description={`Keep docs, tickets and articles with this ${ownerLabel}.`}
        />
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {links.map((link) => {
            const name = link.label?.trim() || link.url;
            const href = safeExternalHref(link.url);
            return (
              <li key={link.id} className="flex items-center gap-1 py-2">
                <div className="min-w-0 flex-1">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-full items-center gap-1.5 text-sm underline-offset-4 hover:underline"
                    >
                      <span className="truncate">{name}</span>
                      <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="truncate text-sm">{name}</p>
                  )}
                  {link.label?.trim() ? <p className="truncate text-xs text-muted-foreground">{link.url}</p> : null}
                </div>
                {canEdit ? (
                  <RowActionsMenu
                    label={`Actions for ${name}`}
                    actions={[
                      { label: "Edit", icon: Pencil, onSelect: () => section.openEdit(link) },
                      { label: "Delete", icon: Trash2, destructive: true, onSelect: () => section.setLinkToDelete(link) },
                    ]}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <ReferenceLinkDialog
        open={section.dialogOpen}
        onOpenChange={section.setDialogOpen}
        link={section.editingLink}
        ownerLabel={ownerLabel}
        onSave={section.save}
      />
      <ConfirmationModal
        open={section.linkToDelete !== null}
        onOpenChange={(open) => !open && section.setLinkToDelete(null)}
        title="Delete this link?"
        description={`"${section.linkToDelete?.label?.trim() || section.linkToDelete?.url || ""}" will be removed from this ${ownerLabel}.`}
        confirmLabel="Delete link"
        confirmVariant="destructive"
        loading={section.deleting}
        onConfirm={section.confirmDelete}
      />
    </Reveal>
  );
}
