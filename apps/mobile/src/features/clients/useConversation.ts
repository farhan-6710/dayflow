import { useQuery } from "@tanstack/react-query";

import { useUserId } from "@/features/auth/AuthProvider";
import { confirm } from "@/lib/confirm";
import { useAction } from "@/lib/query";
import { createWorkspaceClientChatMessage, deleteWorkspaceClientChatMessage, fetchClientChatMessages, updateWorkspaceClientChatMessage } from "@/services/clientChatMessagesService";

export function useConversation(clientId: string) {
  const userId = useUserId();
  const key = `conversation-${clientId}`;
  const query = useQuery({ queryKey: [key], queryFn: () => fetchClientChatMessages(clientId), refetchInterval: 30_000 });
  const send = useAction((body: string) => createWorkspaceClientChatMessage(clientId, userId, body), { failure: "Couldn't send the message.", invalidate: [key] });
  const edit = useAction(({ id, body }: { id: string; body: string }) => updateWorkspaceClientChatMessage(id, body), { success: "Message updated.", failure: "Couldn't update the message.", invalidate: [key], quietError: true });
  const remove = useAction((id: string) => deleteWorkspaceClientChatMessage(id), { success: "Message deleted.", failure: "Couldn't delete the message.", invalidate: [key] });

  return {
    query,
    send,
    edit,
    confirmDelete: async (id: string) => {
      if (await confirm({ title: "Delete this message?", message: "This can't be undone.", confirmLabel: "Delete" })) remove.mutate(id);
    },
  };
}
