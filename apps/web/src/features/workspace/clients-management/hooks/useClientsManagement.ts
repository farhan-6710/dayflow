import { useCallback, useMemo, useState } from "react";

import type { CLIENT_SORT_COLUMNS } from "@/features/workspace/clients-management/constants/directory";
import { deleteClient, fetchClients } from "@/services/clientsService";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";
import { usePagination } from "@/shared/hooks/usePagination";
import type { Client } from "@/shared/types/types";
import { filterByActiveStatus } from "@/shared/utils/activeStatusFilterUtils";
import { matchesListingSearch } from "@/shared/utils/listingSearch";
import { showToast } from "@/shared/utils/showToast";

type SortKey = (typeof CLIENT_SORT_COLUMNS)[number]["key"];

export function useClientsManagement() {
  const { user } = useAuth();
  const userId = user?.id;
  const [statusFilter, setStatusFilter] = useState<ActiveStatusFilterId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [portalFilter, setPortalFilter] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({ key: "company_name", direction: "asc" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loader = useCallback(() => fetchClients(userId ?? ""), [userId]);
  const { data, loading, error, reload, setData } = useLoadData(userId ? loader : null, "Couldn't load your clients.");

  const clients = useMemo(() => data ?? [], [data]);
  const filteredClients = useMemo(() => {
    const matches = filterByActiveStatus(clients, statusFilter).filter(
      (client) =>
        (portalFilter === "all" || Boolean(client.auth_user_id) === (portalFilter === "linked")) &&
        matchesListingSearch(searchQuery, [client.company_name, client.client_name, client.email, client.mobile_number]),
    );
    const direction = sort.direction === "asc" ? 1 : -1;
    return matches.sort((a, b) => direction * (a[sort.key] ?? "").localeCompare(b[sort.key] ?? ""));
  }, [clients, searchQuery, statusFilter, portalFilter, sort]);
  const pagination = usePagination(filteredClients, `${statusFilter}|${portalFilter}|${searchQuery}|${sort.key}|${sort.direction}`);

  function toggleSort(key: SortKey) {
    setSort((current) => ({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" }));
  }

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
    pagination,
    sort,
    toggleSort,
    portalFilter,
    setPortalFilter,
    loading,
    error,
    reload,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    isFiltered: statusFilter !== "all" || portalFilter !== "all" || searchQuery.trim().length > 0,
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
