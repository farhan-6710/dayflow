import { Plus } from "lucide-react";

import { ReminderDialog } from "@/features/workspace/reminders/components/ReminderDialog";
import { RemindersWeeksTable } from "@/features/workspace/reminders/components/RemindersWeeksTable";
import {
  useReminderChecker,
  useRemindersManagement,
} from "@/features/workspace/reminders/hooks/useRemindersManagement";
import { useRemindersCalendarSelection } from "@/features/workspace/reminders/hooks/useRemindersCalendarSelection";
import { PageContent } from "@/shared/components/PageContent";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { RemindersCalendarPageSkeleton } from "@/shared/components/pageSkeletons";
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
    <div className="space-y-4">
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

      {!loading ? (
        <PageContent motionKey={`${year}-${month}`}>
          <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p>
              Active reminders appear on matching weekdays at their scheduled
              time.
            </p>
            <MonthSelector
              year={year}
              month={month}
              onSelect={selectDate}
              className="w-full sm:w-auto"
            />
          </div>

          {error ? <ErrorBanner message={error} /> : null}

          <RemindersWeeksTable
            year={year}
            month={month}
            weeks={calendarWeeks}
            selectedDate={selectedDate}
            getSlot={getSlot}
            onOpenDay={() => openAddDialog()}
            onEdit={openEditDialog}
          />
        </PageContent>
      ) : (
        <RemindersCalendarPageSkeleton />
      )}

      <ReminderDialog {...dialog} />
    </div>
  );
}
