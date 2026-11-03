import { useState, type FormEvent, type KeyboardEvent } from "react";

import type { ClientChatProps } from "@/features/workspace/clients-management/types/components";
import type { ClientChatMessage } from "@/features/workspace/clients-management/types/types";
import {
  createWorkspaceClientChatMessage,
  deleteWorkspaceClientChatMessage,
  updateWorkspaceClientChatMessage,
} from "@/services/clientChatMessagesService";
import { useAuth } from "@/shared/hooks/useAuth";
import { useRegisterUnsavedChanges } from "@/shared/unsaved-changes/useRegisterUnsavedChanges";
import { showToast } from "@/shared/utils/showToast";

export function useClientChat({ clientId, onMessagesChange }: ClientChatProps) {
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const [editingMessage, setEditingMessage] = useState<ClientChatMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ClientChatMessage | null>(null);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /** Throws on failure so the draft and the unsaved-changes modal stay. */
  async function send() {
    const body = draft.trim();
    if (!body || !user) {
      return;
    }
    setSending(true);
    try {
      if (editingMessage) {
        const updated = await updateWorkspaceClientChatMessage(editingMessage.id, body);
        onMessagesChange((messages) => messages.map((message) => (message.id === updated.id ? updated : message)));
        setEditingMessage(null);
        showToast("success", "Message updated.");
      } else {
        const created = await createWorkspaceClientChatMessage(clientId, user.id, body);
        onMessagesChange((messages) => [...messages, created]);
        showToast("success", "Message sent.");
      }
      setDraft("");
    } catch (error) {
      console.error("Failed to send message:", error);
      showToast("error", "Couldn't send that message. Please try again.");
      throw error;
    } finally {
      setSending(false);
    }
  }

  useRegisterUnsavedChanges({
    id: "client-chat-composer",
    isDirty: draft.trim().length > 0 && draft !== (editingMessage?.body ?? ""),
    onSave: send,
  });

  function startEdit(message: ClientChatMessage) {
    setEditingMessage(message);
    setDraft(message.body);
  }

  function cancelEdit() {
    setEditingMessage(null);
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send().catch(() => undefined);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send().catch(() => undefined);
    }
  }

  async function confirmDelete() {
    if (!messageToDelete) {
      return;
    }
    setDeleting(true);
    try {
      await deleteWorkspaceClientChatMessage(messageToDelete.id);
      onMessagesChange((messages) => messages.filter((message) => message.id !== messageToDelete.id));
      if (editingMessage?.id === messageToDelete.id) {
        cancelEdit();
      }
      setMessageToDelete(null);
      showToast("success", "Message deleted.");
    } catch (error) {
      console.error("Failed to delete message:", error);
      showToast("error", "Couldn't delete that message. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return {
    userId: user?.id,
    draft,
    setDraft,
    editingMessage,
    messageToDelete,
    setMessageToDelete,
    sending,
    deleting,
    startEdit,
    cancelEdit,
    handleSubmit,
    handleKeyDown,
    confirmDelete,
  };
}
