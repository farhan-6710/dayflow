import { CircleCheck, CircleOff, KeyRound, Plus, Users } from "lucide-react";

import { ClientDialog } from "@/features/workspace/clients-management/components/ClientDialog";
import { ClientsTable } from "@/features/workspace/clients-management/components/ClientsTable";
import { DELETE_CLIENT_DESCRIPTION } from "@/features/workspace/clients-management/constants/copy";
import { useClientsManagement } from "@/features/workspace/clients-management/hooks/useClientsManagement";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { SummaryStats } from "@/shared/components/SummaryStats";
import { Button } from "@/shared/ui/button";
import { newThisMonthLabel } from "@/shared/utils/newThisMonthLabel";

export function ClientsManagementPage() {
  const page = useClientsManagement();
  const { clients } = page;
  const active = clients.filter((client) => client.is_active).length;

  return (
    <>
      <PageHeader
        heading="Clients Management"
        description="Manage your client relationships and contact details in one place."
        actions={
          <Button size="lg" onClick={page.openCreate}>
            <Plus aria-hidden="true" />
            New Client
          </Button>
        }
      />
      {page.error ? (
        <div className="mb-4">
          <ErrorBanner message={page.error} onRetry={page.reload} />
        </div>
      ) : null}
      {page.error && clients.length === 0 ? null : (
        <div className="grid min-w-0 grid-cols-1 gap-4">
          <SummaryStats
            isLoading={page.loading}
            items={[
              { id: "total", label: "Total Clients", value: clients.length, icon: Users, trend: newThisMonthLabel(clients) },
              { id: "active", label: "Active Clients", value: active, icon: CircleCheck },
              { id: "inactive", label: "Inactive", value: clients.length - active, icon: CircleOff },
              {
                id: "portal",
                label: "Portal Access",
                value: clients.filter((client) => client.auth_user_id).length,
                icon: KeyRound,
              },
            ]}
          />
          <ClientsTable page={page} />
        </div>
      )}
      <ClientDialog
        open={page.dialogOpen}
        onOpenChange={page.setDialogOpen}
        client={page.editingClient}
        onSaved={page.handleSaved}
        onDelete={(client) => {
          page.setDialogOpen(false);
          page.setClientToDelete(client);
        }}
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
