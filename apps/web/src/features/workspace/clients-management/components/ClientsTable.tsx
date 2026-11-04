import { Filter, Plus } from "lucide-react";

import { ClientsTableRow } from "@/features/workspace/clients-management/components/ClientsTableRow";
import {
  CLIENT_PORTAL_FILTERS,
  CLIENT_SORT_COLUMNS,
  CLIENTS_GRID_CLASS,
  clientsTrailingColumns,
} from "@/features/workspace/clients-management/constants/directory";
import type { ClientsTableProps } from "@/features/workspace/clients-management/types/components";
import { ActiveStatusTabs } from "@/shared/components/ActiveStatusTabs";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { ListingToolbar } from "@/shared/components/ListingToolbar";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { TablePagination } from "@/shared/components/TablePagination";
import { Button } from "@/shared/ui/button";

const STATUS_LABELS = { all: "All Clients", active: "Active", inactive: "Inactive" };

export function ClientsTable({ page }: ClientsTableProps) {
  const active = page.clients.filter((client) => client.is_active).length;
  const columns = [
    ...CLIENT_SORT_COLUMNS.map(({ key, label }) => ({
      label,
      onSort: () => page.toggleSort(key),
      sortDirection: page.sort.key === key ? page.sort.direction : null,
    })),
    ...clientsTrailingColumns,
  ];

  return (
    <DirectoryTable
      gridClass={CLIENTS_GRID_CLASS}
      columns={columns}
      isLoading={page.loading}
      isEmpty={page.filteredClients.length === 0}
      emptyImage={page.isFiltered ? "icon-empty-search" : "icon-empty-clients"}
      emptyTitle={page.isFiltered ? "No matching clients" : "No clients yet"}
      emptyDescription={
        page.isFiltered ? "Try a different search or status." : "Add a client to share projects and activities with them."
      }
      emptyAction={
        page.isFiltered ? undefined : (
          <Button size="lg" onClick={page.openCreate}>
            <Plus aria-hidden="true" />
            New Client
          </Button>
        )
      }
      headerAside={
        <ListingToolbar
          tabs={
            <ActiveStatusTabs
              value={page.statusFilter}
              onChange={page.setStatusFilter}
              labels={STATUS_LABELS}
              counts={page.loading ? undefined : { all: page.clients.length, active, inactive: page.clients.length - active }}
            />
          }
          filter={
            <OptionDropdown
              label="Filter by portal access"
              value={page.portalFilter}
              onChange={page.setPortalFilter}
              options={CLIENT_PORTAL_FILTERS}
              icon={Filter}
              className="w-auto"
            />
          }
          search={
            <ListingSearchInput value={page.searchQuery} onChange={page.setSearchQuery} placeholder="Search clients, company or email…" />
          }
        />
      }
      footer={<TablePagination pagination={page.pagination} noun="clients" />}
    >
      {page.pagination.pageItems.map((client) => (
        <ClientsTableRow key={client.id} client={client} onEdit={page.openEdit} onDelete={page.setClientToDelete} />
      ))}
    </DirectoryTable>
  );
}
