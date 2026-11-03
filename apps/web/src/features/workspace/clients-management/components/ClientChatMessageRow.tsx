import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

import type { ClientChatMessageRowProps } from "@/features/workspace/clients-management/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

function authorName({ message, clientLabel }: Pick<ClientChatMessageRowProps, "message" | "clientLabel">): string {
  if (message.author_user_id) {
    const author = Array.isArray(message.author_user) ? message.author_user[0] : message.author_user;
    return author?.display_name?.trim() || "You";
  }
  const author = Array.isArray(message.author_client) ? message.author_client[0] : message.author_client;
  return author?.client_name?.trim() || author?.company_name?.trim() || clientLabel;
}

export function ClientChatMessageRow({ message, clientLabel, isOwn, disabled, onEdit, onDelete }: ClientChatMessageRowProps) {
  return (
    <li className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] min-w-0 rounded-xl px-3 py-2",
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        <p className={cn("text-xs", isOwn ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {authorName({ message, clientLabel })} · {format(new Date(message.created_at), "MMM d, h:mm a")}
          {message.updated_at !== message.created_at ? " · edited" : ""}
        </p>
        <p className="mt-0.5 text-sm break-words whitespace-pre-wrap">{message.body}</p>
        {isOwn ? (
          <div className="mt-1 flex justify-end">
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 text-primary-foreground/80 hover:bg-primary-foreground/15 hover:text-primary-foreground"
              aria-label="Edit message"
              disabled={disabled}
              onClick={() => onEdit(message)}
            >
              <Pencil aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 text-primary-foreground/80 hover:bg-primary-foreground/15 hover:text-primary-foreground"
              aria-label="Delete message"
              disabled={disabled}
              onClick={() => onDelete(message)}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>
    </li>
  );
}
