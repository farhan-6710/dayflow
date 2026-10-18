import { ReminderNotificationsTable } from "@/features/workspace/notifications/components/ReminderNotificationsTable";
import { TaskNotificationsTable } from "@/features/workspace/notifications/components/TaskNotificationsTable";
import { useNotificationsInbox } from "@/features/workspace/notifications/hooks/useNotificationsInbox";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { NotificationsPageSkeleton } from "@/shared/components/pageSkeletons";

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
    <div className="space-y-4">
      <PageHeader
        heading="Notifications"
        description="In-app alerts for reminders and task updates in your personal workspace."
      />

      {!isLoading ? (
        <PageContent>
          {error ? <ErrorBanner message={error} /> : null}

          <ReminderNotificationsTable
            notifications={reminderNotifications}
            isLoading={false}
            dismissingId={dismissingId}
            onDismiss={(notificationId) =>
              void dismissNotification(notificationId)
            }
          />

          <TaskNotificationsTable
            notifications={taskNotifications}
            isLoading={false}
            dismissingId={dismissingId}
            onDismiss={(notificationId) =>
              void dismissNotification(notificationId)
            }
          />
        </PageContent>
      ) : (
        <NotificationsPageSkeleton />
      )}
    </div>
  );
}
