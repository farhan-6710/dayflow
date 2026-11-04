import { useState } from "react";
import { format } from "date-fns";
import { Activity, Folder, LayoutGrid, MessageSquare, Pencil, Trash2 } from "lucide-react";

import { WORKSPACE_CLIENTS_MANAGEMENT_PATH } from "@/app/constants/workspaceRoutes";
import { ActivitySummaryStats } from "@/features/workspace/client-activities/components/ActivitySummaryStats";
import { ClientActivitiesBlock } from "@/features/workspace/client-activities/components/ClientActivitiesBlock";
import type { ActivityRows } from "@/features/workspace/client-activities/types/components";
import { ClientChat } from "@/features/workspace/clients-management/components/ClientChat";
import { ClientDialog } from "@/features/workspace/clients-management/components/ClientDialog";
import { ClientProjectsSection } from "@/features/workspace/clients-management/components/ClientProjectsSection";
import { ClientSummary } from "@/features/workspace/clients-management/components/ClientSummary";
import { DELETE_CLIENT_DESCRIPTION } from "@/features/workspace/clients-management/constants/copy";
import { useClientDetail } from "@/features/workspace/clients-management/hooks/useClientDetail";
import { ClientDetailSkeleton } from "@/features/workspace/clients-management/components/ClientDetailSkeleton";
import { BackLink } from "@/shared/components/BackLink";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { PillTabs } from "@/shared/components/PillTabs";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";
import { StatusPill } from "@/shared/components/StatusPill";
import { cn } from "@/shared/lib/utils";
import { ProjectFormDialog } from "@/shared/projects/components/ProjectFormDialog";
import { Button } from "@/shared/ui/button";

const TABS = [
  { value: "overview", label: "Overview", icon: LayoutGrid },
  { value: "projects", label: "Projects", icon: Folder },
  { value: "activities", label: "Activities", icon: Activity },
  { value: "conversation", label: "Conversation", icon: MessageSquare },
];

const backLink = <BackLink to={WORKSPACE_CLIENTS_MANAGEMENT_PATH}>Clients Management</BackLink>;

export function ClientDetailPage() {
  const page = useClientDetail();
  const { client } = page;
  const [tab, setTab] = useState("overview");
  const [activityRows, setActivityRows] = useState<ActivityRows | null>(null);

  if (page.loading) {
    return <ClientDetailSkeleton />;
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

  const showOn = (section: string) => (tab === "overview" || tab === section ? "min-w-0" : "hidden");

  return (
    <>
      <PageHeader
        backButton={
          <Breadcrumbs back items={[{ label: "Clients Management", to: WORKSPACE_CLIENTS_MANAGEMENT_PATH }, { label: client.company_name }]} />
        }
        leading={
          <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-xl bg-primary text-2xl text-primary-foreground shadow-xs">
            {client.company_name.charAt(0).toUpperCase()}
          </span>
        }
        heading={<span className="break-words">{client.company_name}</span>}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <StatusPill active={client.is_active}>{client.is_active ? "Active" : "Inactive"}</StatusPill>
            {client.client_name ? <span>{client.client_name}</span> : null}
            <span>Updated {format(new Date(client.updated_at), "MMM d, yyyy")}</span>
          </span>
        }
        actions={
          <>
            <Button variant="outline" size="lg" onClick={() => page.setEditOpen(true)}>
              <Pencil aria-hidden="true" />
              Edit Client
            </Button>
            <RowActionsMenu
              label={`More actions for ${client.company_name}`}
              actions={[{ label: "Delete", icon: Trash2, destructive: true, onSelect: () => page.setDeleteOpen(true) }]}
            />
          </>
        }
      />
      <div className="grid min-w-0 grid-cols-1 gap-4">
        {page.error ? <ErrorBanner message={page.error} onRetry={page.reload} /> : null}
        <div className="border-b border-border pb-3">
          <PillTabs label="Client sections" value={tab} onChange={setTab} options={TABS} />
        </div>
        {tab === "overview" ? <ActivitySummaryStats rows={activityRows} /> : null}
        {/* Sections stay mounted across tabs, so nothing refetches or loses a chat draft. */}
        <div className={cn("grid min-w-0 items-start gap-4", tab === "overview" && "xl:grid-cols-[minmax(0,1fr)_22rem]")}>
          <div className="grid min-w-0 grid-cols-1 gap-4">
            <div className={showOn("projects")}>
              <ClientProjectsSection
                projects={page.projects}
                canAdd={client.is_active}
                onAdd={() => page.setProjectDialogOpen(true)}
              />
            </div>
            <div className={showOn("activities")}>
              <ClientActivitiesBlock
                scope="client"
                clientId={client.id}
                projects={page.projects.filter((project) => project.is_active)}
                canEdit={client.is_active}
                onRowsChange={setActivityRows}
              />
            </div>
            <div className={showOn("conversation")}>
              <ClientChat
                clientId={client.id}
                clientLabel={client.company_name}
                messages={page.messages}
                onMessagesChange={page.setMessages}
              />
            </div>
          </div>
          <div className={cn(tab === "overview" ? "min-w-0 xl:sticky xl:top-4" : "hidden")}>
            <ClientSummary client={client} />
          </div>
        </div>
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
