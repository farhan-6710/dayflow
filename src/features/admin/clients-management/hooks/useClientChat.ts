import { useCallback, useState } from "react";

import { useAuth } from "@/features/admin/auth/hooks/useAuth";
import type { ClientChatMessage } from "@/features/admin/clients-management/types/types";
import { isWorkspaceAuthoredChatMessage } from "@/features/admin/clients-management/utils/clientChatMessageDb";
import {
  createWorkspaceClientChatMessage,
  deleteWorkspaceClientChatMessage,
  updateWorkspaceClientChatMessage,
} from "@/services/clientChatMessagesService";
import { showToast } from "@/shared/utils/showToast";

type UseClientChatOptions = {
  clientId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useClientChat({ clientId, reload, setError }: UseClientChatOptions) {
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const cancelEdit = useCallback(() => {
    setEditingMessageId(null);
    setDraft("");
  }, []);

  const startEdit = useCallback(
    (message: ClientChatMessage) => {
      if (!user || !isWorkspaceAuthoredChatMessage(message, user.id)) {
        return;
      }

      setPendingDeleteId(null);
      setEditingMessageId(message.id);
      setDraft(message.body);
    },
    [user],
  );

  const sendMessage = useCallback(async () => {
    if (isSending || !user) {
      return;
    }

    const body = draft.trim();
    if (!body) {
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      if (editingMessageId) {
        await updateWorkspaceClientChatMessage(editingMessageId, body);
        showToast("success", "Message updated.");
        setEditingMessageId(null);
      } else {
        await createWorkspaceClientChatMessage({
          clientId,
          userId: user.id,
          body,
        });
      }

      setDraft("");
      await reload();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : editingMessageId
            ? "Failed to update message."
            : "Failed to send message.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSending(false);
    }
  }, [clientId, draft, editingMessageId, isSending, reload, setError, user]);

  const requestDelete = useCallback(
    (messageId: string) => {
      if (editingMessageId === messageId) {
        cancelEdit();
      }
      setPendingDeleteId(messageId);
    },
    [cancelEdit, editingMessageId],
  );

  const cancelDelete = useCallback(() => {
    if (isDeleting) {
      return;
    }
    setPendingDeleteId(null);
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    if (!pendingDeleteId || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteWorkspaceClientChatMessage(pendingDeleteId);
      showToast("success", "Message deleted.");
      setPendingDeleteId(null);
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete message.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, pendingDeleteId, reload, setError]);

  return {
    draft,
    setDraft,
    isSending,
    sendMessage,
    editingMessageId,
    startEdit,
    cancelEdit,
    requestDelete,
    deleteConfirmOpen: Boolean(pendingDeleteId),
    onDeleteConfirmOpenChange: (open: boolean) => {
      if (!open) {
        cancelDelete();
      }
    },
    confirmDelete,
    isDeleting,
  };
}
