import { format } from "date-fns";
import { Pencil, Send, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";

import { useUserId } from "@/features/auth/AuthProvider";
import { useConversation } from "@/features/clients/useConversation";
import { cn } from "@/lib/cn";
import type { ClientChatMessage } from "@/shared/types/types";
import { useTheme } from "@/theme/ThemeProvider";
import { ActionSheet } from "@/ui/ActionSheet";
import { EmptyState } from "@/ui/EmptyState";
import { ErrorState } from "@/ui/ErrorState";
import { FormSheet } from "@/ui/FormSheet";
import { IconButton } from "@/ui/IconButton";
import { Input } from "@/ui/Input";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { Text } from "@/ui/Text";

export function ConversationPanel({ clientId }: { clientId: string }) {
  const userId = useUserId();
  const { colors } = useTheme();
  const { query, send, edit, confirmDelete } = useConversation(clientId);
  const [draft, setDraft] = useState("");
  const [selected, setSelected] = useState<ClientChatMessage | null>(null);
  const [editing, setEditing] = useState<ClientChatMessage | null>(null);
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    if (editing) setEditBody(editing.body);
  }, [editing]);

  const messages = [...(query.data ?? [])].reverse();

  function submit() {
    const body = draft.trim();
    if (!body || send.isPending) return;
    setDraft("");
    send.mutate(body, { onError: () => setDraft(body) });
  }

  return (
    <View className="flex-1">
      {query.isError && !query.data ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : !query.data ? (
        <View className="flex-1 px-4">
          <ListSkeleton rows={4} />
        </View>
      ) : messages.length === 0 ? (
        <View className="flex-1 justify-center">
          <EmptyState art="activities" title="No messages yet" description="Keep notes on what you and this client discussed." />
        </View>
      ) : (
        <FlatList
          inverted
          data={messages}
          keyExtractor={(message) => message.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, gap: 8 }}
          renderItem={({ item }) => {
            const mine = item.author_user_id === userId;
            return (
              <Pressable
                accessibilityLabel={`${mine ? "You" : "Client"}: ${item.body}`}
                onLongPress={mine ? () => setSelected(item) : undefined}
                className={cn("max-w-[82%] rounded-2xl px-3.5 py-2.5", mine ? "self-end bg-primary" : "self-start border border-border bg-card")}
              >
                <Text tone={mine ? "inverse" : "default"}>{item.body}</Text>
                <Text variant="caption" tone={mine ? "inverse" : "muted"} className="mt-1 opacity-70">
                  {format(new Date(item.created_at), "MMM d, h:mm a")}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
      <View className="flex-row items-end gap-2 border-t border-border bg-background px-3 py-2">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          multiline
          placeholder="Write a message"
          accessibilityLabel="Write a message"
          placeholderTextColor={colors["muted-foreground"]}
          selectionColor={colors["chart-1"]}
          className="max-h-28 min-h-11 flex-1 rounded-xl border border-input bg-card px-3.5 py-2.5 font-sans text-[15px] text-foreground"
        />
        <View className="rounded-full bg-primary">
          <IconButton icon={Send} label="Send message" iconColor={colors["primary-foreground"]} disabled={!draft.trim()} onPress={submit} />
        </View>
      </View>
      <ActionSheet
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Message"
        actions={
          selected
            ? [
                { label: "Edit", icon: Pencil, onPress: () => setEditing(selected) },
                { label: "Delete", icon: Trash2, destructive: true, onPress: () => void confirmDelete(selected.id) },
              ]
            : []
        }
      />
      <FormSheet
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit message"
        submitLabel="Save"
        dirty={editBody !== editing?.body}
        canSubmit={Boolean(editBody.trim())}
        onSubmit={() => edit.mutateAsync({ id: editing?.id ?? "", body: editBody })}
      >
        <Input label="Message" value={editBody} onChangeText={setEditBody} multiline />
      </FormSheet>
    </View>
  );
}
