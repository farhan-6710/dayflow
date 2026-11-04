import { useQuery } from "@tanstack/react-query";

import { useUserId } from "@/features/auth/AuthProvider";
import { confirm } from "@/lib/confirm";
import { useAction } from "@/lib/query";
import { createClient, deleteClient, fetchClientById, fetchClients, updateClient, type CreateClientInput, type UpdateClientInput } from "@/services/clientsService";
import type { Client } from "@/shared/types/types";

export function useClients() {
  const userId = useUserId();
  return useQuery({ queryKey: ["clients"], queryFn: () => fetchClients(userId) });
}

export function useClient(id: string) {
  return useQuery({ queryKey: ["clients", id], queryFn: () => fetchClientById(id) });
}

export function useClientActions() {
  const userId = useUserId();
  const create = useAction((input: CreateClientInput) => createClient(userId, input), {
    success: "Client added.",
    failure: "Couldn't add the client.",
    invalidate: ["clients"],
    quietError: true,
  });
  const update = useAction(({ id, input }: { id: string; input: UpdateClientInput }) => updateClient(id, input), {
    success: "Client saved.",
    failure: "Couldn't save the client.",
    invalidate: ["clients", "projects"],
    quietError: true,
  });
  const setActive = useAction(
    ({ client, isActive }: { client: Client; isActive: boolean }) =>
      updateClient(client.id, {
        companyName: client.company_name,
        clientName: client.client_name,
        mobileNumber: client.mobile_number,
        email: client.email,
        secondaryContactName: client.secondary_contact_name,
        secondaryContactNumber: client.secondary_contact_number,
        websiteUrl: client.website_url,
        isActive,
      }),
    { success: "Client updated.", failure: "Couldn't update the client.", invalidate: ["clients"] },
  );
  const remove = useAction((id: string) => deleteClient(id), {
    success: "Client deleted.",
    failure: "Couldn't delete the client.",
    invalidate: ["clients", "projects", "activities", "activity-counts"],
  });

  return {
    create,
    update,
    setActive,
    confirmDelete: async (client: Client) => {
      const ok = await confirm({
        title: `Delete ${client.company_name}?`,
        message: "Their conversation goes with them, and their projects become personal. This can't be undone.",
        confirmLabel: "Delete",
      });
      if (ok) remove.mutate(client.id);
      return ok;
    },
  };
}
