import { Plus } from "lucide-react";

import { ClientDialog } from "@/features/workspace/clients-management/components/ClientDialog";
import { ClientsTable } from "@/features/workspace/clients-management/components/ClientsTable";
import { DELETE_CLIENT_DESCRIPTION } from "@/features/workspace/clients-management/constants/copy";
import { useClientsManagement } from "@/features/workspace/clients-management/hooks/useClientsManagement";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function ClientsManagementPage() {
  const page = useClientsManagement();

  return (
    <>
      <PageHeader
        heading="Clients Management"
        description="Company and contact details for everyone you work with."
        actions={
          <Button size="lg" onClick={page.openCreate}>
            <Plus aria-hidden="true" />
            New client
          </Button>
        }
      />
      {page.error ? (
        <div className="mb-4">
          <ErrorBanner message={page.error} onRetry={page.reload} />
        </div>
      ) : null}
      {page.error && page.clients.length === 0 ? null : (
        <ClientsTable
          clients={page.filteredClients}
          isFiltered={page.isFiltered}
          isLoading={page.loading}
          statusFilter={page.statusFilter}
          onStatusFilterChange={page.setStatusFilter}
          searchQuery={page.searchQuery}
          onSearchQueryChange={page.setSearchQuery}
          onCreate={page.openCreate}
          onEdit={page.openEdit}
          onDelete={page.setClientToDelete}
        />
      )}
      <ClientDialog
        open={page.dialogOpen}
        onOpenChange={page.setDialogOpen}
        client={page.editingClient}
        onSaved={page.handleSaved}
      />
      <ConfirmationModal
        open={page.clientToDelete !== null}
        onOpenChange={(open) => !open && page.setClientToDelete(null)}
        title={`Delete ${page.clientToDelete?.company_name ?? "client"}?`}
        description={DELETE_CLIENT_DESCRIPTION}
        confirmLabel="Delete client"
        confirmVariant="destructive"
        loading={page.deleting}
        onConfirm={page.confirmDelete}
      />
    </>
  );
}
