import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useAuth } from "@/features/admin/auth/hooks/useAuth";
import { CLIENTS_MANAGEMENT_PATH } from "@/features/admin/clients-management/constants/routes";
import { useClientDialog } from "@/features/admin/clients-management/hooks/useClientDialog";
import type { Client, ClientChatMessage } from "@/features/admin/clients-management/types/types";
import { fetchClientChatMessages } from "@/services/clientChatMessagesService";
import { fetchClientById } from "@/services/clientsService";
import { showToast } from "@/shared/utils/showToast";

export function useClientDetail() {
  const { user: admin, loading: authLoading } = useAuth();
  const { id: clientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<ClientChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (authLoading || !clientId || !admin) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [clientRow, messageRows] = await Promise.all([
        fetchClientById(clientId),
        fetchClientChatMessages(clientId),
      ]);

      if (!clientRow || clientRow.admin_id !== admin.id) {
        showToast("error", "Client not found.");
        navigate(CLIENTS_MANAGEMENT_PATH);
        return;
      }

      setClient(clientRow);
      setMessages(messageRows);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to load client.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  }, [authLoading, clientId, navigate, admin]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const { openEditDialog, dialog } = useClientDialog({
    reload,
    setError,
  });

  return {
    client,
    messages,
    loading: authLoading || loading,
    error,
    setError,
    reload,
    openEditDialog,
    dialog,
  };
}
