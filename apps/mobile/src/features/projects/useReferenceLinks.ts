import { useQuery } from "@tanstack/react-query";

import { useUserId } from "@/features/auth/AuthProvider";
import { confirm } from "@/lib/confirm";
import { useAction } from "@/lib/query";
import { createNoteReferenceLink, deleteNoteReferenceLink, fetchNoteReferenceLinks, updateNoteReferenceLink } from "@/services/noteReferenceLinksService";
import { createProjectReferenceLink, deleteProjectReferenceLink, fetchProjectReferenceLinks, updateProjectReferenceLink } from "@/services/projectReferenceLinksService";
import type { CreateReferenceLinkInput, ReferenceLink } from "@/shared/types/types";

export type LinkOwner = { kind: "project" | "note"; id: string };

/** Reference links work the same on a project and on a note. */
export function useReferenceLinks(owner: LinkOwner) {
  const userId = useUserId();
  const key = ["links", owner.kind, owner.id];
  const isProject = owner.kind === "project";
  const invalidate = ["links"];

  const query = useQuery<ReferenceLink[]>({
    queryKey: key,
    queryFn: () => (isProject ? fetchProjectReferenceLinks(owner.id) : fetchNoteReferenceLinks(owner.id)),
  });
  const create = useAction(
    (input: CreateReferenceLinkInput): Promise<ReferenceLink> => (isProject ? createProjectReferenceLink(userId, owner.id, input) : createNoteReferenceLink(userId, owner.id, input)),
    { success: "Link added.", failure: "Couldn't add the link.", invalidate, quietError: true },
  );
  const update = useAction(
    ({ id, input }: { id: string; input: CreateReferenceLinkInput }): Promise<ReferenceLink> => (isProject ? updateProjectReferenceLink(id, input) : updateNoteReferenceLink(id, input)),
    { success: "Link saved.", failure: "Couldn't save the link.", invalidate, quietError: true },
  );
  const remove = useAction((id: string) => (isProject ? deleteProjectReferenceLink(id) : deleteNoteReferenceLink(id)), {
    success: "Link deleted.",
    failure: "Couldn't delete the link.",
    invalidate,
  });

  return {
    query,
    create,
    update,
    confirmDelete: async (link: ReferenceLink) => {
      if (await confirm({ title: `Delete ${link.label || "this link"}?`, message: "This can't be undone.", confirmLabel: "Delete" })) remove.mutate(link.id);
    },
  };
}
