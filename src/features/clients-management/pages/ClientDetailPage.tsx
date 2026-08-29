import { ArrowLeft, Pencil } from "lucide-react";
import { Link } from "react-router";

import { ClientChat } from "@/features/clients-management/components/ClientChat";
import { ClientDetailSummary } from "@/features/clients-management/components/ClientDetailSummary";
import { ClientDialog } from "@/features/clients-management/components/ClientDialog";
import { CLIENTS_MANAGEMENT_PATH } from "@/features/clients-management/constants/routes";
import { useClientChat } from "@/features/clients-management/hooks/useClientChat";
import { useClientDetail } from "@/features/clients-management/hooks/useClientDetail";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function ClientDetailPage() {
  const { user: admin } = useAuth();
  const {
    client,
    messages,
    loading,
    error,
    setError,
    reload,
    openEditDialog,
    dialog,
  } = useClientDetail();

  const {
    draft,
    setDraft,
    isSending,
    sendMessage,
    editingMessageId,
    startEdit,
    cancelEdit,
    requestDelete,
    deleteConfirmOpen,
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

  if (!client || !admin) {
    return null;
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
          <Button variant="outline" onClick={() => openEditDialog(client)}>
            <Pencil className="mr-1 size-4" />
            Edit Client
          </Button>
        }
      />

      <PageContent>
        {error ? <ErrorBanner message={error} /> : null}
        <div className="grid items-start gap-4 lg:grid-cols-2 lg:items-stretch">
          <ClientDetailSummary client={client} />
          <ClientChat
            clientContactLabel={clientContactLabel}
            currentAdminId={admin.id}
            messages={messages}
            draft={draft}
            onDraftChange={setDraft}
            onSend={() => void sendMessage()}
            onRefresh={() => void reload()}
            isSending={isSending}
            isRefreshing={loading}
            editingMessageId={editingMessageId}
            onEditMessage={startEdit}
            onCancelEdit={cancelEdit}
            onDeleteMessage={requestDelete}
            deleteConfirmOpen={deleteConfirmOpen}
            onDeleteConfirmOpenChange={onDeleteConfirmOpenChange}
            onConfirmDelete={() => void confirmDelete()}
            isDeleting={isDeleting}
          />
        </div>
      </PageContent>

      <ClientDialog {...dialog} />
    </div>
  );
}

export default ClientDetailPage;
