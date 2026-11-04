import { useEffect, useRef } from "react";
import { MessageSquare, Send } from "lucide-react";

import { ClientChatMessageRow } from "@/features/workspace/clients-management/components/ClientChatMessageRow";
import { useClientChat } from "@/features/workspace/clients-management/hooks/useClientChat";
import type { ClientChatProps } from "@/features/workspace/clients-management/types/components";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { PanelHeading } from "@/shared/components/PanelHeading";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";

export function ClientChat(props: ClientChatProps) {
  const { messages, clientLabel } = props;
  const chat = useClientChat(props);
  const listRef = useRef<HTMLUListElement>(null);

  // Scroll this list only, so a new message never moves the page.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  return (
    <Reveal as="section" className={cn(panelClassName, "flex min-w-0 flex-col p-5")}>
      <PanelHeading icon={MessageSquare} title="Conversation" />
      {messages.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No messages yet. Keep notes and updates about {clientLabel} here.
        </p>
      ) : (
        <ul ref={listRef} className="mt-3 flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
          {messages.map((message) => (
            <ClientChatMessageRow
              key={message.id}
              message={message}
              clientLabel={clientLabel}
              isOwn={message.author_user_id === chat.userId}
              disabled={chat.sending}
              onEdit={chat.startEdit}
              onDelete={chat.setMessageToDelete}
            />
          ))}
        </ul>
      )}
      <form onSubmit={chat.handleSubmit} className="mt-4 space-y-2">
        <Textarea
          value={chat.draft}
          onChange={(event) => chat.setDraft(event.target.value)}
          onKeyDown={chat.handleKeyDown}
          disabled={chat.sending}
          placeholder={chat.editingMessage ? "Edit your message" : "Write a message. Enter sends, Shift+Enter adds a line."}
          aria-label={chat.editingMessage ? "Edit message" : "New message"}
          className="min-h-20 bg-background"
        />
        <div className="flex justify-end gap-2">
          {chat.editingMessage ? (
            <Button type="button" variant="ghost" size="lg" disabled={chat.sending} onClick={chat.cancelEdit}>
              Cancel
            </Button>
          ) : null}
          <SubmitButton loading={chat.sending} disabled={!chat.draft.trim()}>
            {chat.sending ? null : <Send aria-hidden="true" />}
            {chat.editingMessage ? "Save" : "Send"}
          </SubmitButton>
        </div>
      </form>
      <ConfirmationModal
        open={chat.messageToDelete !== null}
        onOpenChange={(open) => !open && chat.setMessageToDelete(null)}
        title="Delete this message?"
        description="It will be removed from the conversation. This can't be undone."
        confirmLabel="Delete message"
        confirmVariant="destructive"
        loading={chat.deleting}
        onConfirm={chat.confirmDelete}
      />
    </Reveal>
  );
}
