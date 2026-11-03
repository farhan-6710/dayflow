import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { WORKSPACE_CLIENTS_MANAGEMENT_PATH } from "@/app/constants/workspaceRoutes";
import type { ClientChatMessage } from "@/features/workspace/clients-management/types/types";
import { fetchClientChatMessages } from "@/services/clientChatMessagesService";
import { deleteClient, fetchClientById, fetchClients } from "@/services/clientsService";
import { fetchProjectsByClientId } from "@/services/projectsService";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";
import type { Client, Project } from "@/shared/types/types";
import { showToast } from "@/shared/utils/showToast";

export function useClientDetail() {
  const { user } = useAuth();
  const userId = user?.id;
  const { id: clientId = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loader = useCallback(async () => {
    const [client, projects, messages, clients] = await Promise.all([
      fetchClientById(clientId),
      fetchProjectsByClientId(userId ?? "", clientId),
      fetchClientChatMessages(clientId),
      fetchClients(userId ?? ""),
    ]);
    return { client: client?.owner_user_id === userId ? client : null, projects, messages, clients };
  }, [clientId, userId]);
  const { data, loading, error, reload, setData } = useLoadData(userId ? loader : null, "Couldn't load this client.");

  const setMessages = useCallback(
    (update: (messages: ClientChatMessage[]) => ClientChatMessage[]) => {
      setData((current) => ({ ...current, messages: update(current.messages) }));
    },
    [setData],
  );

  function handleClientSaved(client: Client) {
    setData((current) => ({ ...current, client }));
  }

  function handleProjectSaved(project: Project) {
    setData((current) => ({ ...current, projects: [project, ...current.projects] }));
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteClient(clientId);
      showToast("success", "Client deleted.");
      void navigate(WORKSPACE_CLIENTS_MANAGEMENT_PATH);
    } catch (deleteError) {
      console.error("Failed to delete client:", deleteError);
      showToast("error", "Couldn't delete the client. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return {
    client: data?.client ?? null,
    projects: data?.projects ?? [],
    messages: data?.messages ?? [],
    clients: data?.clients ?? [],
    loading,
    error,
    reload,
    editOpen,
    setEditOpen,
    projectDialogOpen,
    setProjectDialogOpen,
    deleteOpen,
    setDeleteOpen,
    deleting,
    setMessages,
    handleClientSaved,
    handleProjectSaved,
    confirmDelete,
  };
}
