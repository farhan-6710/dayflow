import { useCallback, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ClientChatMessage } from "@/features/clients-management/types/types";
import { isAdminAuthoredChatMessage } from "@/features/clients-management/utils/clientChatMessageDb";
import {
  createAdminClientChatMessage,
  deleteAdminClientChatMessage,
  updateAdminClientChatMessage,
} from "@/services/clientChatMessagesService";
import { showToast } from "@/shared/utils/showToast";

type UseClientChatOptions = {
  clientId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useClientChat({ clientId, reload, setError }: UseClientChatOptions) {
  const { user: admin } = useAuth();
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
      if (!admin || !isAdminAuthoredChatMessage(message, admin.id)) {
        return;
      }

      setPendingDeleteId(null);
      setEditingMessageId(message.id);
      setDraft(message.body);
    },
    [admin],
  );

  const sendMessage = useCallback(async () => {
    if (isSending || !admin) {
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
        await updateAdminClientChatMessage(editingMessageId, body);
        showToast("success", "Message updated.");
        setEditingMessageId(null);
      } else {
        await createAdminClientChatMessage({
          clientId,
          adminId: admin.id,
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
  }, [admin, clientId, draft, editingMessageId, isSending, reload, setError]);

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
      await deleteAdminClientChatMessage(pendingDeleteId);
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
