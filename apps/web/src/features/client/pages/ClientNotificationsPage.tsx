import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { NotificationList } from "@/shared/notifications/components/NotificationList";
import { useNotificationsInbox } from "@/shared/notifications/hooks/useNotificationsInbox";

export function ClientNotificationsPage() {
  const inbox = useNotificationsInbox();

  return (
    <>
      <PageHeader heading="Notifications" description="Unread updates on your account." />
      {inbox.error ? (
        <div className="mb-4">
          <ErrorBanner message={inbox.error} onRetry={inbox.reload} />
        </div>
      ) : null}
      {inbox.loading ? (
        <TableSkeleton rows={4} panel />
      ) : inbox.error ? null : (
        <NotificationList
          notifications={inbox.notifications}
          emptyLabel="You have no unread notifications."
          markingId={inbox.markingId}
          onMarkRead={(id) => void inbox.markRead(id)}
        />
      )}
    </>
  );
}
