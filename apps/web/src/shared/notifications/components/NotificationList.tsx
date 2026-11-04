import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";

import { EmptyState } from "@/shared/components/EmptyState";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { NotificationListProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

export function NotificationList({ title, notifications, emptyLabel, markingId, onMarkRead }: NotificationListProps) {
  return (
    <Reveal as="section" className={cn(panelClassName, "min-w-0 p-5")}>
      {title ? <h2 className="text-xl">{title}</h2> : null}
      {notifications.length === 0 ? (
        <EmptyState bare className="py-6" image="icon-empty-notifications" title="All caught up" description={emptyLabel} />
      ) : (
        <ul className="mt-2 divide-y divide-border">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex items-start gap-2 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="break-words">{notification.title}</p>
                <p className="text-sm text-pretty text-muted-foreground">{notification.message}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </div>
              <Button
                variant="ghost"
                className="h-10 shrink-0"
                disabled={markingId === notification.id}
                onClick={() => onMarkRead(notification.id)}
              >
                <Check aria-hidden="true" />
                Mark read
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}
