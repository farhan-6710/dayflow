import { BellRing, Clock3, PencilLine, Plus } from "lucide-react";

import { REMINDER_DAY_OPTIONS } from "@/features/reminders/constants/remindersCalendar";
import { ReminderDialog } from "@/features/reminders/components/ReminderDialog";
import {
  useReminderChecker,
  useRemindersManagement,
} from "@/features/reminders/hooks/useRemindersManagement";
import { PageContent } from "@/shared/components/PageContent";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

function formatReminderDays(daysOfWeek: string[]) {
  if (daysOfWeek.length === REMINDER_DAY_OPTIONS.length) {
    return "Every day";
  }

  return "Repeats on selected days";
}

export function RemindersManagementPage() {
  const {
    reminders,
    loading,
    error,
    dialog,
    openAddDialog,
    openEditDialog,
  } = useRemindersManagement();

  useReminderChecker(reminders);

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Daily Reminders"
        description="Manage recurring reminders by weekday and time. Use this space for repeatable nudges, not date-based tasks."
        actions={
          <Button onClick={openAddDialog}>
            <Plus className="mr-1 size-4" />
            Add Reminder
          </Button>
        }
      />

      <PageContent>
        {error ? <ErrorBanner message={error} /> : null}

        {loading ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground shadow-2xs">
            Loading reminders...
          </div>
        ) : reminders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/70 px-6 py-14 text-center shadow-2xs">
            <BellRing className="mx-auto size-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No reminders yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first recurring reminder for workouts, medicine, study blocks, or any weekday routine.
            </p>
            <Button className="mt-5" onClick={openAddDialog}>
              <Plus className="mr-1 size-4" />
              Create Reminder
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {reminders.map((reminder) => (
              <article
                key={reminder.id}
                className={cn(
                  "rounded-3xl border p-5 shadow-2xs transition",
                  reminder.is_disabled
                    ? "border-border/70 bg-muted/40 text-muted-foreground"
                    : "border-border bg-card text-foreground",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          reminder.is_disabled
                            ? "bg-background/70 text-muted-foreground"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        <Clock3 className="size-3.5" />
                        {reminder.reminder_time}
                      </span>
                      {reminder.is_disabled ? (
                        <span className="rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] font-semibold">
                          Disabled
                        </span>
                      ) : null}
                    </div>
                    <h3
                      className={cn(
                        "mt-4 text-base font-semibold leading-tight",
                        reminder.is_disabled && "text-foreground/70",
                      )}
                    >
                      {reminder.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      {formatReminderDays(reminder.days_of_week)}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 rounded-full"
                    onClick={() => openEditDialog(reminder.id)}
                  >
                    <PencilLine className="size-4" />
                    <span className="sr-only">Edit reminder</span>
                  </Button>
                </div>

                {reminder.description ? (
                  <p
                    className={cn(
                      "mt-4 text-sm leading-relaxed",
                      reminder.is_disabled ? "text-muted-foreground" : "text-muted-foreground",
                    )}
                  >
                    {reminder.description}
                  </p>
                ) : (
                  <p className="mt-4 text-sm italic text-muted-foreground">
                    No extra description added.
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {REMINDER_DAY_OPTIONS.map((day) => {
                    const isSelected = reminder.days_of_week.includes(day.key);

                    return (
                      <span
                        key={day.key}
                        className={cn(
                          "inline-flex size-9 items-center justify-center rounded-full border text-xs font-semibold",
                          isSelected && !reminder.is_disabled
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background/60 text-muted-foreground",
                        )}
                        title={day.label}
                      >
                        {day.initial}
                      </span>
                    );
                  })}
                </div>

                {reminder.is_disabled && reminder.disabled_until ? (
                  <p className="mt-4 text-xs font-medium text-muted-foreground">
                    Disabled until {reminder.disabled_until}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </PageContent>

      <ReminderDialog {...dialog} />
    </div>
  );
}

export default RemindersManagementPage;
