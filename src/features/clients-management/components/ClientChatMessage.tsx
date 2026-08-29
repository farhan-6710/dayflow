import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

import type { ClientChatMessageProps } from "@/features/clients-management/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function ClientChatMessage({
  message,
  isMine,
  authorLabel,
  isEditing,
  canManage = false,
  disabled = false,
  onEdit,
  onDelete,
}: ClientChatMessageProps) {
  return (
    <div
      className={cn(
        "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[85%]",
        isMine
          ? "ml-auto bg-primary text-primary-foreground"
          : "bg-muted text-foreground",
        isEditing && "ring-2 ring-primary-foreground/40",
      )}
    >
      <div
        className={cn(
          "mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-[11px]",
          isMine ? "text-primary-foreground/80" : "text-muted-foreground",
        )}
      >
        <span className="font-semibold">
          {authorLabel}
          {isEditing ? " · Editing" : null}
        </span>
        <div className="flex items-center gap-1">
          <span>{format(new Date(message.created_at), "MMM d, h:mm a")}</span>
          {canManage ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={disabled}
                className="size-6 text-primary-foreground/80 hover:bg-primary-foreground/15 hover:text-primary-foreground"
                onClick={onEdit}
                aria-label="Edit message"
              >
                <Pencil className="size-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={disabled}
                className="size-6 text-primary-foreground/80 hover:bg-primary-foreground/15 hover:text-primary-foreground"
                onClick={onDelete}
                aria-label="Delete message"
              >
                <Trash2 className="size-3" />
              </Button>
            </>
          ) : null}
        </div>
      </div>
      <p className="whitespace-pre-wrap break-words">{message.body}</p>
    </div>
  );
}
