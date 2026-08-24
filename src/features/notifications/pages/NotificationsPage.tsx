import { ReminderNotificationsTable } from "@/features/notifications/components/ReminderNotificationsTable";
import { TaskNotificationsTable } from "@/features/notifications/components/TaskNotificationsTable";
import { useNotificationsInbox } from "@/features/notifications/hooks/useNotificationsInbox";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";

export function NotificationsPage() {
  const {
    reminderNotifications,
    taskNotifications,
    isLoading,
    error,
    dismissingId,
    dismissNotification,
  } = useNotificationsInbox();

  return (
    <PageContent>
      <PageHeader
        heading="Notifications"
        description="In-app alerts for reminders and task updates in your personal workspace."
      />

      {error ? <ErrorBanner message={error} /> : null}

      <div className="space-y-6">
        <ReminderNotificationsTable
          notifications={reminderNotifications}
          isLoading={isLoading}
          dismissingId={dismissingId}
          onDismiss={(notificationId) => void dismissNotification(notificationId)}
        />

        <TaskNotificationsTable
          notifications={taskNotifications}
          isLoading={isLoading}
          dismissingId={dismissingId}
          onDismiss={(notificationId) => void dismissNotification(notificationId)}
        />
      </div>
    </PageContent>
  );
}
