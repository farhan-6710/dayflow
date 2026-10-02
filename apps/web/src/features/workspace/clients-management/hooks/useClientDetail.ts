import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { CLIENTS_MANAGEMENT_PATH } from "@/features/workspace/clients-management/constants/routes";
import { useClientDialog } from "@/features/workspace/clients-management/hooks/useClientDialog";
import type {
  Client,
  ClientChatMessage,
} from "@/features/workspace/clients-management/types/types";
import { DEFAULT_PROJECT_COLOR } from "@/features/workspace/projects/constants/projectColors";
import { projectForToSelectValue } from "@/features/workspace/projects/utils/projectFor";
import { fetchClientChatMessages } from "@/services/clientChatMessagesService";
import { deleteClient, fetchClientById } from "@/services/clientsService";
import {
  createProject,
  fetchProjectsByClientId,
  type Project,
} from "@/services/projectsService";
import { showToast } from "@/shared/utils/showToast";

export function useClientDetail() {
  const { user, loading: authLoading } = useAuth();
  const { id: clientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<ClientChatMessage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectColor, setProjectColor] = useState<string>(DEFAULT_PROJECT_COLOR);
  const [projectFor, setProjectFor] = useState("");
  const [submittingProject, setSubmittingProject] = useState(false);
  const [deletingClient, setDeletingClient] = useState(false);

  const reload = useCallback(async () => {
    if (authLoading || !clientId || !user) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [clientRow, messageRows, projectRows] = await Promise.all([
        fetchClientById(clientId),
        fetchClientChatMessages(clientId),
        fetchProjectsByClientId(user.id, clientId),
      ]);

      if (!clientRow || clientRow.owner_user_id !== user.id) {
        showToast("error", "Client not found.");
        navigate(CLIENTS_MANAGEMENT_PATH);
        return;
      }

      setClient(clientRow);
      setMessages(messageRows);
      setProjects(projectRows);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to load client.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  }, [authLoading, clientId, navigate, user]);

  useEffect(() => {
    // eslint-disable-next-line
    void reload();
  }, [reload]);

  const { openEditDialog, dialog } = useClientDialog({
    reload,
    setError,
    onDeleted: () => navigate(CLIENTS_MANAGEMENT_PATH),
  });

  const openCreateProjectDialog = useCallback(() => {
    if (!client) return;
    setProjectName("");
    setProjectColor(DEFAULT_PROJECT_COLOR);
    setProjectFor(projectForToSelectValue(client.id));
    setProjectDialogOpen(true);
  }, [client]);

  const handleCreateProject = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!user || !client || !projectName.trim()) return;

      try {
        setSubmittingProject(true);
        const created = await createProject(user.id, {
          name: projectName.trim(),
          color_hex: projectColor,
          project_for: client.id,
        });
        setProjects((prev) => [created, ...prev]);
        setProjectDialogOpen(false);
        showToast("success", "Project created successfully");
      } catch (err) {
        console.error(err);
        showToast("error", "Failed to create project");
      } finally {
        setSubmittingProject(false);
      }
    },
    [user, client, projectName, projectColor],
  );

  const handleDeleteClient = useCallback(async () => {
    if (!client || deletingClient) return;
    try {
      setDeletingClient(true);
      await deleteClient(client.id);
      showToast("success", `"${client.company_name}" removed successfully.`);
      navigate(CLIENTS_MANAGEMENT_PATH);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to delete client.";
      setError(message);
      showToast("error", message);
      throw err;
    } finally {
      setDeletingClient(false);
    }
  }, [client, deletingClient, navigate]);

  return {
    client,
    messages,
    projects,
    loading: authLoading || loading,
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
  };
}
