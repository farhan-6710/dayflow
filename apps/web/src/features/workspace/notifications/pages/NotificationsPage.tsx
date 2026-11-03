import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { NotificationList } from "@/shared/notifications/components/NotificationList";
import { useNotificationsInbox } from "@/shared/notifications/hooks/useNotificationsInbox";

export function NotificationsPage() {
  const inbox = useNotificationsInbox();
  const sharedProps = { markingId: inbox.markingId, onMarkRead: (id: string) => void inbox.markRead(id) };

  return (
    <>
      <PageHeader heading="Notifications" description="Unread alerts for your reminders and tasks." />
      {inbox.error ? (
        <div className="mb-4">
          <ErrorBanner message={inbox.error} onRetry={inbox.reload} />
        </div>
      ) : null}
      {inbox.loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
          <NotificationList
            {...sharedProps}
            title="Reminders"
            notifications={inbox.notifications.filter((item) => item.notification_type === "reminder")}
            emptyLabel="Alerts appear here when a reminder's time comes."
          />
          <NotificationList
            {...sharedProps}
            title="Tasks"
            notifications={inbox.notifications.filter((item) => item.notification_type === "task")}
            emptyLabel="No unread task alerts."
          />
        </div>
      )}
    </>
  );
}
