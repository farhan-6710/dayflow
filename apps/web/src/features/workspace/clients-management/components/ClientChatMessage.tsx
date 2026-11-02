import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

import type { ClientChatMessageProps } from "@/features/workspace/clients-management/types/components";
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
        "max-w-[90%] rounded-[0.9rem] px-3.5 py-2.5 text-sm sm:max-w-[85%]",
        isMine
          ? "ml-auto border border-tint/40 bg-[color-mix(in_srgb,var(--tint)_45%,var(--card))] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-none"
          : "surface-chip text-foreground",
        isEditing && "ring-3 ring-ring/50",
      )}
    >
      <div
        className={cn(
          "mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-xs",
          isMine ? "text-foreground/70" : "text-muted-foreground",
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
                className="size-6 text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
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
                className="size-6 text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
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
