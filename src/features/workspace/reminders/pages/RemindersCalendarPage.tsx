import { Plus } from "lucide-react";

import { ReminderDialog } from "@/features/admin/reminders/components/ReminderDialog";
import { RemindersWeeksTable } from "@/features/admin/reminders/components/RemindersWeeksTable";
import {
  useReminderChecker,
  useRemindersManagement,
} from "@/features/admin/reminders/hooks/useRemindersManagement";
import { useRemindersCalendarSelection } from "@/features/admin/reminders/hooks/useRemindersCalendarSelection";
import { PageContent } from "@/shared/components/PageContent";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { PageHeader } from "@/shared/components/PageHeader";
import { MonthSelector } from "@/shared/ui/MonthSelector";
import { Button } from "@/shared/ui/button";

export function RemindersCalendarPage() {
  const { selectedDate, calendarWeeks, year, month, selectDate } =
    useRemindersCalendarSelection();

  const {
    reminders,
    loading,
    error,
    getSlot,
    dialog,
    openAddDialog,
    openEditDialog,
  } = useRemindersManagement();

  useReminderChecker(reminders);

  return (
    <PageContent>
      <PageHeader
        heading="Reminders Calendar"
        description="Browse recurring reminders by month. Add reminders with days, time, and optional disable periods."
        actions={
          <Button
            type="button"
            className="gap-2 rounded-full px-5 shadow-sm"
            onClick={openAddDialog}
          >
            <Plus className="size-4" />
            Add Reminder
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>Active reminders appear on matching weekdays at their scheduled time.</p>
          <MonthSelector
            year={year}
            month={month}
            onSelect={selectDate}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      {loading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border bg-card">
          <LoadingSpinner />
        </div>
      ) : (
        <RemindersWeeksTable
          year={year}
          month={month}
          weeks={calendarWeeks}
          selectedDate={selectedDate}
          getSlot={getSlot}
          onOpenDay={() => openAddDialog()}
          onEdit={openEditDialog}
        />
      )}

      <ReminderDialog {...dialog} />
    </PageContent>
  );
}
