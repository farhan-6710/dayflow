import { useCallback, useMemo, useState } from "react";

import { deleteClient, fetchClients } from "@/services/clientsService";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";
import type { Client } from "@/shared/types/types";
import { filterByActiveStatus } from "@/shared/utils/activeStatusFilterUtils";
import { matchesListingSearch } from "@/shared/utils/listingSearch";
import { showToast } from "@/shared/utils/showToast";

export function useClientsManagement() {
  const { user } = useAuth();
  const userId = user?.id;
  const [statusFilter, setStatusFilter] = useState<ActiveStatusFilterId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loader = useCallback(() => fetchClients(userId ?? ""), [userId]);
  const { data, loading, error, reload, setData } = useLoadData(userId ? loader : null, "Couldn't load your clients.");

  const clients = useMemo(() => data ?? [], [data]);
  const filteredClients = useMemo(
    () =>
      filterByActiveStatus(clients, statusFilter).filter((client) =>
        matchesListingSearch(searchQuery, [client.company_name, client.client_name, client.email, client.mobile_number]),
      ),
    [clients, searchQuery, statusFilter],
  );

  function openCreate() {
    setEditingClient(null);
    setDialogOpen(true);
  }

  function openEdit(client: Client) {
    setEditingClient(client);
    setDialogOpen(true);
  }

  function handleSaved(saved: Client) {
    setData((current) =>
      current.some((client) => client.id === saved.id)
        ? current.map((client) => (client.id === saved.id ? saved : client))
        : [...current, saved].sort((a, b) => a.company_name.localeCompare(b.company_name)),
    );
  }

  async function confirmDelete() {
    if (!clientToDelete) {
      return;
    }
    setDeleting(true);
    try {
      await deleteClient(clientToDelete.id);
      setData((current) => current.filter((client) => client.id !== clientToDelete.id));
      setClientToDelete(null);
      showToast("success", "Client deleted.");
    } catch (deleteError) {
      console.error("Failed to delete client:", deleteError);
      showToast("error", "Couldn't delete the client. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return {
    clients,
    filteredClients,
    loading,
    error,
    reload,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    isFiltered: statusFilter !== "all" || searchQuery.trim().length > 0,
    dialogOpen,
    setDialogOpen,
    editingClient,
    clientToDelete,
    setClientToDelete,
    deleting,
    openCreate,
    openEdit,
    handleSaved,
    confirmDelete,
  };
}
