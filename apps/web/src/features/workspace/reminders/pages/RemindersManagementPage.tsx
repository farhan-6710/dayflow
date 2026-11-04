import { Plus } from "lucide-react";

import { ReminderDialog } from "@/features/workspace/reminders/components/ReminderDialog";
import { RemindersWeekTable } from "@/features/workspace/reminders/components/RemindersWeekTable";
import { useRemindersManagement } from "@/features/workspace/reminders/hooks/useRemindersManagement";
import { dayKeyForDate } from "@/features/workspace/reminders/utils/reminderSchedule";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { Button } from "@/shared/ui/button";

export function RemindersManagementPage() {
  const page = useRemindersManagement();
  const addButton = (
    <Button size="lg" onClick={() => page.openAdd(dayKeyForDate(new Date()))}>
      <Plus aria-hidden="true" />
      New reminder
    </Button>
  );

  return (
    <>
      <PageHeader
        heading="Daily Reminders"
        description="Repeating nudges by weekday and time. Dated work belongs in the Tasks Calendar."
        actions={addButton}
      />
      {page.error ? (
        <div className="mb-4">
          <ErrorBanner message={page.error} onRetry={page.reload} />
        </div>
      ) : null}
      {page.loading ? (
        <TableSkeleton rows={6} />
      ) : page.reminders.length === 0 && !page.error ? (
        <EmptyState
          image="icon-empty-reminders"
          title="No reminders yet"
          description="Set a reminder for anything you want to repeat, like a weekly client check-in."
          action={addButton}
        />
      ) : (
        <RemindersWeekTable reminders={page.reminders} onEdit={page.openEdit} />
      )}
      <ReminderDialog
        open={page.dialogOpen}
        onOpenChange={page.setDialogOpen}
        reminder={page.editingReminder}
        defaultDay={page.defaultDay}
        onSave={page.save}
        onDelete={page.setReminderToDelete}
      />
      <ConfirmationModal
        open={page.reminderToDelete !== null}
        onOpenChange={(open) => !open && page.setReminderToDelete(null)}
        title={`Delete "${page.reminderToDelete?.title ?? ""}"?`}
        description="It will stop repeating on all its days. This can't be undone."
        confirmLabel="Delete reminder"
        confirmVariant="destructive"
        loading={page.deleting}
        onConfirm={page.confirmDelete}
      />
    </>
  );
}
