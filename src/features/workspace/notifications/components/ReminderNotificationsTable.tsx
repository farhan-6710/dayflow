import { format } from "date-fns";
import { Loader2, X } from "lucide-react";

import { reminderNotificationsDirectoryConfig } from "@/features/workspace/notifications/constants/notificationTypes";
import type { ReminderNotificationsTableProps } from "@/features/workspace/notifications/types/components";
import { WORKSPACE_DAILY_REMINDERS_PATH } from "@/app/constants/workspaceRoutes";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function ReminderNotificationsTable({
  notifications,
  isLoading,
  dismissingId,
  onDismiss,
}: ReminderNotificationsTableProps) {
  return (
    <DirectoryTable
      title={reminderNotificationsDirectoryConfig.title}
      description={reminderNotificationsDirectoryConfig.description}
      gridClass={reminderNotificationsDirectoryConfig.gridClass}
      columns={[...reminderNotificationsDirectoryConfig.columns]}
      emptyMessage={reminderNotificationsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={notifications.length === 0}
    >
      {notifications.map((notification) => (
        <DirectoryTableRow
          key={notification.id}
          to={WORKSPACE_DAILY_REMINDERS_PATH}
          className={cn(
            "grid items-center gap-4 px-6 py-4",
            reminderNotificationsDirectoryConfig.gridClass,
          )}
        >
          <p className="min-w-0 truncate text-sm font-medium text-foreground">
            {notification.title}
          </p>
          <p className="min-w-0 truncate text-sm text-muted-foreground">
            {notification.message}
          </p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(notification.created_at), "MMM d, yyyy")}
          </p>
          <div className="flex items-center justify-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={dismissingId === notification.id}
              aria-label="Dismiss notification"
              onClick={(event) => {
                stopDirectoryRowNav(event);
                onDismiss(notification.id);
              }}
            >
              {dismissingId === notification.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
            </Button>
          </div>
        </DirectoryTableRow>
      ))}
    </DirectoryTable>
  );
}
