import { Pencil, Trash2 } from "lucide-react";

import { WORKSPACE_CLIENTS_MANAGEMENT_PATH } from "@/app/constants/workspaceRoutes";
import { ClientActivitiesBlock } from "@/features/workspace/client-activities/components/ClientActivitiesBlock";
import { ClientChat } from "@/features/workspace/clients-management/components/ClientChat";
import { ClientDialog } from "@/features/workspace/clients-management/components/ClientDialog";
import { ClientProjectsSection } from "@/features/workspace/clients-management/components/ClientProjectsSection";
import { ClientSummary } from "@/features/workspace/clients-management/components/ClientSummary";
import { DELETE_CLIENT_DESCRIPTION } from "@/features/workspace/clients-management/constants/copy";
import { useClientDetail } from "@/features/workspace/clients-management/hooks/useClientDetail";
import { BackLink } from "@/shared/components/BackLink";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatusPill } from "@/shared/components/StatusPill";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { ProjectFormDialog } from "@/shared/projects/components/ProjectFormDialog";
import { Button } from "@/shared/ui/button";

const backLink = <BackLink to={WORKSPACE_CLIENTS_MANAGEMENT_PATH}>Clients Management</BackLink>;

export function ClientDetailPage() {
  const page = useClientDetail();
  const { client } = page;

  if (page.loading) {
    return <TableSkeleton rows={6} />;
  }
  if (page.error && !client) {
    return (
      <div className="space-y-3">
        {backLink}
        <ErrorBanner message={page.error} onRetry={page.reload} />
      </div>
    );
  }
  if (!client) {
    return (
      <div className="space-y-3">
        {backLink}
        <EmptyState
          image="icon-empty-clients"
          title="Client not found"
          description="They may have been deleted, or the link is out of date."
        />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        backButton={backLink}
        heading={<span className="break-words">{client.company_name}</span>}
        description={<StatusPill active={client.is_active}>{client.is_active ? "Active" : "Inactive"}</StatusPill>}
        actions={
          <>
            <Button variant="outline" size="lg" onClick={() => page.setEditOpen(true)}>
              <Pencil aria-hidden="true" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="[&_svg]:text-destructive"
              onClick={() => page.setDeleteOpen(true)}
            >
              <Trash2 aria-hidden="true" />
              Delete
            </Button>
          </>
        }
      />
      <div className="grid min-w-0 gap-4">
        {page.error ? <ErrorBanner message={page.error} onRetry={page.reload} /> : null}
        <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <ClientSummary client={client} />
          <ClientProjectsSection
            projects={page.projects}
            canAdd={client.is_active}
            onAdd={() => page.setProjectDialogOpen(true)}
          />
        </div>
        <ClientActivitiesBlock
          scope="client"
          clientId={client.id}
          projects={page.projects.filter((project) => project.is_active)}
          canEdit={client.is_active}
        />
        <ClientChat
          clientId={client.id}
          clientLabel={client.company_name}
          messages={page.messages}
          onMessagesChange={page.setMessages}
        />
      </div>
      <ClientDialog open={page.editOpen} onOpenChange={page.setEditOpen} client={client} onSaved={page.handleClientSaved} />
      <ProjectFormDialog
        open={page.projectDialogOpen}
        onOpenChange={page.setProjectDialogOpen}
        project={null}
        clients={page.clients}
        defaultProjectFor={client.id}
        lockProjectFor
        onSaved={page.handleProjectSaved}
      />
      <ConfirmationModal
        open={page.deleteOpen}
        onOpenChange={page.setDeleteOpen}
        title={`Delete ${client.company_name}?`}
        description={DELETE_CLIENT_DESCRIPTION}
        confirmLabel="Delete client"
        confirmVariant="destructive"
        loading={page.deleting}
        onConfirm={page.confirmDelete}
      />
    </>
  );
}
