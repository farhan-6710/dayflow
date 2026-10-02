import { useState } from "react";
import { ArrowLeft, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";

import { ClientChat } from "@/features/workspace/clients-management/components/ClientChat";
import { ClientDetailSummary } from "@/features/workspace/clients-management/components/ClientDetailSummary";
import { ClientDialog } from "@/features/workspace/clients-management/components/ClientDialog";
import { ClientProjectsSection } from "@/features/workspace/clients-management/components/ClientProjectsSection";
import { ClientActivitiesBlock } from "@/features/workspace/client-activities/components/ClientActivitiesBlock";
import { CLIENTS_MANAGEMENT_PATH } from "@/features/workspace/clients-management/constants/routes";
import { useClientChat } from "@/features/workspace/clients-management/hooks/useClientChat";
import { useClientDetail } from "@/features/workspace/clients-management/hooks/useClientDetail";
import { ProjectFormDialog } from "@/features/workspace/projects/components/ProjectFormDialog";
import { PROJECTS_MANAGEMENT_PATH } from "@/features/workspace/projects/constants/routes";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function ClientDetailPage() {
  const { user } = useAuth();
  const {
    client,
    messages,
    projects,
    loading,
    error,
    setError,
    reload,
    openEditDialog,
    dialog,
    projectDialogOpen,
    setProjectDialogOpen,
    projectName,
    setProjectName,
    projectColor,
    setProjectColor,
    projectFor,
    setProjectFor,
    submittingProject,
    deletingClient,
    openCreateProjectDialog,
    handleCreateProject,
    handleDeleteClient,
  } = useClientDetail();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const {
    draft,
    setDraft,
    isSending,
    sendMessage,
    editingMessageId,
    startEdit,
    cancelEdit,
    requestDelete,
    deleteConfirmOpen: chatDeleteConfirmOpen,
    onDeleteConfirmOpenChange,
    confirmDelete,
    isDeleting,
  } = useClientChat({
    clientId: client?.id ?? "",
    reload,
    setError,
  });

  if (loading && !client) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Loading client...
      </div>
    );
  }

  if (!client || !user) {
    return (
      <div className="space-y-4 py-6">
        {error ? <ErrorBanner message={error} /> : null}
        <div className="py-6 text-center text-sm text-muted-foreground">
          Client not found.
        </div>
        <Link
          to={CLIENTS_MANAGEMENT_PATH}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Clients Management
        </Link>
      </div>
    );
  }

  const clientContactLabel =
    client.client_name?.trim() || client.company_name.trim();

  return (
    <div className="space-y-6">
      <PageHeader
        heading={client.company_name}
        description={`Client details and chat with ${clientContactLabel}.`}
        backButton={
          <Link
            to={CLIENTS_MANAGEMENT_PATH}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to Clients Management
          </Link>
        }
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to={PROJECTS_MANAGEMENT_PATH}>See all projects</Link>
            </Button>
            <Button
              variant="outline"
              onClick={openCreateProjectDialog}
              disabled={!client.is_active}
            >
              <FolderPlus className="mr-1 size-4" />
              New Project
            </Button>
            <Button variant="outline" onClick={() => openEditDialog(client)}>
              <Pencil className="mr-1 size-4" />
              Edit Client
            </Button>
            <Button
              variant="destructive-outline"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="mr-1 size-4" />
              Delete
            </Button>
          </>
        }
      />

      <PageContent>
        {error ? <ErrorBanner message={error} /> : null}
        <div className="grid items-start gap-4 lg:grid-cols-2 lg:items-stretch">
          <ClientDetailSummary client={client} />
          <ClientChat
            clientContactLabel={clientContactLabel}
            currentUserId={user.id}
            messages={messages}
            draft={draft}
            onDraftChange={setDraft}
            onSend={() => void sendMessage()}
            onRefresh={() => void reload()}
            isSending={isSending}
            isLoading={loading && messages.length === 0}
            isRefreshing={loading}
            editingMessageId={editingMessageId}
            onEditMessage={startEdit}
            onCancelEdit={cancelEdit}
            onDeleteMessage={requestDelete}
            deleteConfirmOpen={chatDeleteConfirmOpen}
            onDeleteConfirmOpenChange={onDeleteConfirmOpenChange}
            onConfirmDelete={() => void confirmDelete()}
            isDeleting={isDeleting}
          />
        </div>

        <ClientProjectsSection
          projects={projects}
          isLoading={loading}
          canAddProject={client.is_active}
          onAddProject={openCreateProjectDialog}
        />

        <ClientActivitiesBlock
          scope="client"
          clientId={client.id}
          projects={projects}
        />
      </PageContent>

      <ClientDialog {...dialog} />

      <ProjectFormDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        isEditing={false}
        submitting={submittingProject}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        projectColor={projectColor}
        onProjectColorChange={setProjectColor}
        projectFor={projectFor}
        onProjectForChange={setProjectFor}
        clients={[client]}
        lockProjectFor
        onSubmit={handleCreateProject}
      />

      <ConfirmationModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete client?"
        description={`This permanently deletes "${client.company_name}" from your directory.`}
        confirmLabel="Delete client"
        confirmVariant="destructive"
        loading={deletingClient}
        onConfirm={async () => {
          await handleDeleteClient();
          setDeleteConfirmOpen(false);
        }}
      />
    </div>
  );
}

export default ClientDetailPage;
