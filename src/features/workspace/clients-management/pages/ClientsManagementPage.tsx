import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { ClientDialog } from "@/features/admin/clients-management/components/ClientDialog";
import { ClientsTable } from "@/features/admin/clients-management/components/ClientsTable";
import { useClientDialog } from "@/features/admin/clients-management/hooks/useClientDialog";
import { useClientsQuery } from "@/features/admin/clients-management/hooks/useClientsQuery";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";
import { filterByActiveStatus } from "@/shared/utils/activeStatusFilterUtils";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function ClientsManagementPage() {
  const { clients, isLoading, error, setError, reload } = useClientsQuery();
  const { openAddDialog, openEditDialog, dialog } = useClientDialog({
    reload,
    setError,
  });
  const [statusFilter, setStatusFilter] = useState<ActiveStatusFilterId>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = useMemo(() => {
    return filterByActiveStatus(clients, statusFilter).filter((client) =>
      matchesListingSearch(searchQuery, [
        client.company_name,
        client.client_name,
        client.email,
        client.mobile_number,
        client.website_url,
      ]),
    );
  }, [clients, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Clients Management"
        description="Manage client companies and contact details for freelance and office work."
        actions={
          <Button onClick={openAddDialog} className="rounded-full shadow-sm">
            <Plus className="mr-2 size-4" />
            Add Client
          </Button>
        }
      />

      <PageContent>
        {error ? <ErrorBanner message={error} /> : null}
        <ClientsTable
          clients={filteredClients}
          isLoading={isLoading}
          onEditClient={openEditDialog}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />
      </PageContent>

      <ClientDialog {...dialog} />
    </div>
  );
}

export default ClientsManagementPage;
