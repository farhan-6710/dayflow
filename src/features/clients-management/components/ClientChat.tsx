import { Loader2, RefreshCw, Send } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent } from "react";

import { ClientChatMessage } from "@/features/clients-management/components/ClientChatMessage";
import type { ClientChatProps } from "@/features/clients-management/types/components";
import {
  getClientChatMessageAuthorLabel,
  isAdminAuthoredChatMessage,
} from "@/features/clients-management/utils/clientChatMessageDb";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function ClientChat({
  clientContactLabel,
  currentAdminId,
  messages,
  draft,
  onDraftChange,
  onSend,
  onRefresh,
  isSending,
  isRefreshing = false,
  editingMessageId = null,
  onEditMessage,
  onCancelEdit,
  onDeleteMessage,
  deleteConfirmOpen = false,
  onDeleteConfirmOpenChange,
  onConfirmDelete,
  isDeleting = false,
}: ClientChatProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isEditing = Boolean(editingMessageId);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) {
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    const el = textareaRef.current;
    if (!el) {
      return;
    }
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [isEditing, editingMessageId]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape" && isEditing && onCancelEdit) {
      event.preventDefault();
      onCancelEdit();
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex h-full max-h-[min(40rem,calc(100dvh-12rem))] min-h-[24rem] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:min-h-[28rem]">
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">Client chat</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            One-to-one thread with {clientContactLabel}. Admin messages send
            from here; client replies come from the client portal.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={onRefresh}
          disabled={isRefreshing || isSending || isDeleting}
        >
          {isRefreshing ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No messages yet. Send the first message to {clientContactLabel}.
          </p>
        ) : (
          messages.map((message) => {
            const isMine = isAdminAuthoredChatMessage(message, currentAdminId);
            const authorLabel = isMine
              ? "You"
              : getClientChatMessageAuthorLabel(message, clientContactLabel);

            return (
              <ClientChatMessage
                key={message.id}
                message={message}
                isMine={isMine}
                authorLabel={authorLabel}
                isEditing={editingMessageId === message.id}
                disabled={isSending || isDeleting}
                canManage={isMine}
                onEdit={() => onEditMessage?.(message)}
                onDelete={() => onDeleteMessage?.(message.id)}
              />
            );
          })
        )}
      </div>

      <div className="relative shrink-0 border-t border-border px-4 py-4 sm:px-5">
        {isEditing ? (
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Editing message — Esc to cancel
          </p>
        ) : null}

        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message…"
          disabled={isSending || isDeleting}
          className={cn(formFieldClassName, "max-h-32 min-h-20 resize-none")}
        />
        <div className="mt-2 flex justify-end gap-2">
          {isEditing && onCancelEdit ? (
            <Button
              type="button"
              variant="outline"
              disabled={isSending || isDeleting}
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="button"
            disabled={isSending || isDeleting || !draft.trim()}
            onClick={onSend}
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {isEditing ? "Save" : "Send"}
          </Button>
        </div>
      </div>

      {onDeleteConfirmOpenChange && onConfirmDelete ? (
        <ConfirmationModal
          open={deleteConfirmOpen}
          onOpenChange={onDeleteConfirmOpenChange}
          title="Delete message?"
          description="This removes the message from the client chat. This cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          loading={isDeleting}
          onConfirm={onConfirmDelete}
        />
      ) : null}
    </div>
  );
}
