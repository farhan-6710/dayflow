import { Plus } from "lucide-react";

import { ClientsTableRow } from "@/features/workspace/clients-management/components/ClientsTableRow";
import { CLIENTS_GRID_CLASS, clientsColumns } from "@/features/workspace/clients-management/constants/directory";
import type { ClientsTableProps } from "@/features/workspace/clients-management/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { Button } from "@/shared/ui/button";

const STATUS_LABELS = { all: "All clients", active: "Active", inactive: "Inactive" };

export function ClientsTable({
  clients,
  isFiltered,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  onCreate,
  onEdit,
  onDelete,
}: ClientsTableProps) {
  return (
    <DirectoryTable
      gridClass={CLIENTS_GRID_CLASS}
      columns={clientsColumns}
      isLoading={isLoading}
      isEmpty={clients.length === 0}
      emptyImage={isFiltered ? "icon-empty-search" : "icon-empty-clients"}
      emptyTitle={isFiltered ? "No matching clients" : "No clients yet"}
      emptyDescription={
        isFiltered ? "Try a different search or status." : "Add a client to share projects and activities with them."
      }
      emptyAction={
        isFiltered ? undefined : (
          <Button size="lg" onClick={onCreate}>
            <Plus aria-hidden="true" />
            New client
          </Button>
        )
      }
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <ListingSearchInput value={searchQuery} onChange={onSearchQueryChange} placeholder="Search clients" />
          <ActiveStatusFilter value={statusFilter} onChange={onStatusFilterChange} labels={STATUS_LABELS} />
        </div>
      }
    >
      {clients.map((client) => (
        <ClientsTableRow key={client.id} client={client} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </DirectoryTable>
  );
}
