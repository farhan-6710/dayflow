import { BellRing, Clock3, PencilLine, Plus } from "lucide-react";

import { REMINDER_DAY_OPTIONS } from "@/features/workspace/reminders/constants/remindersCalendar";
import { ReminderDialog } from "@/features/workspace/reminders/components/ReminderDialog";
import {
  useReminderChecker,
  useRemindersManagement,
} from "@/features/workspace/reminders/hooks/useRemindersManagement";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { DAYFLOW_IMAGES } from "@/shared/constants/dayflowImages";
import { FluidWaveItem } from "@/shared/components/FluidWaveItem";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { RemindersManagementPageSkeleton } from "@/shared/components/pageSkeletons";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { glassPanelClassName } from "@/shared/constants/layoutStyles";

function formatReminderDays(daysOfWeek: string[]) {
  if (daysOfWeek.length === REMINDER_DAY_OPTIONS.length) {
    return "Every day";
  }

  return "Repeats on selected days";
}

export function RemindersManagementPage() {
  const { reminders, loading, error, dialog, openAddDialog, openEditDialog } =
    useRemindersManagement();

  useReminderChecker(reminders);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Daily routine"
        heading="Daily Reminders"
        description="Manage recurring reminders by weekday and time. Use this space for repeatable nudges, not date-based tasks."
        actions={
          <Button onClick={openAddDialog}>
            <Plus className="size-4" />
            Add Reminder
          </Button>
        }
      />

      {!loading ? (
        <PageContent
          motionKey={reminders.length === 0 ? "empty" : "list"}
          stagger={false}
        >
          {error ? <ErrorBanner message={error} /> : null}

          {reminders.length === 0 ? (
            <EmptyState
              imageSrc={DAYFLOW_IMAGES.emptyReminders}
              icon={BellRing}
              title="No reminders yet"
              description="Add your first recurring reminder for workouts, medicine, study blocks, or any weekday routine."
              action={
                <Button onClick={openAddDialog}>
                  <Plus className="size-4" />
                  Create Reminder
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reminders.map((reminder, index) => (
                <FluidWaveItem key={reminder.id} index={index} className="flex [&>article]:flex-1">
                  <article
                    className={cn(
                      glassPanelClassName,
                      "flex h-full flex-col p-5",
                      reminder.is_disabled ? "opacity-70" : "tone-primary",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "tabular inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold",
                              reminder.is_disabled
                                ? "border-border bg-secondary text-muted-foreground"
                                : "border-primary/40 bg-[linear-gradient(165deg,color-mix(in_srgb,var(--primary)_55%,white),color-mix(in_srgb,var(--primary)_38%,var(--card)))] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:bg-[color-mix(in_srgb,var(--primary)_25%,var(--card))] dark:shadow-none",
                            )}
                          >
                            <Clock3 className="size-3.5" />
                            {reminder.reminder_time}
                          </span>
                          {reminder.is_disabled ? (
                            <span className="inline-flex h-6 items-center rounded-full border border-border bg-secondary px-2.5 text-xs font-medium text-muted-foreground">
                              Disabled
                            </span>
                          ) : null}
                        </div>
                        <h3
                          className={cn(
                            "mt-3 text-xl leading-snug font-bold text-pretty",
                            reminder.is_disabled && "text-foreground/70",
                          )}
                        >
                          {reminder.title}
                        </h3>
                        <p className="mt-1.5 text-xs font-medium tracking-[0.08em] text-primary-text uppercase">
                          {formatReminderDays(reminder.days_of_week)}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="-mt-1 -mr-2 shrink-0 text-muted-foreground"
                        onClick={() => openEditDialog(reminder.id)}
                      >
                        <PencilLine className="size-4" />
                        <span className="sr-only">Edit reminder</span>
                      </Button>
                    </div>

                    {reminder.description ? (
                      <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-foreground/70">
                        {reminder.description}
                      </p>
                    ) : (
                      <p className="mt-4 text-sm italic text-muted-foreground">
                        No extra description added.
                      </p>
                    )}
                    <div className="min-h-4 flex-1" />

                    <div className="mt-auto flex flex-wrap gap-1.5 border-t border-foreground/10 pt-4">
                      {REMINDER_DAY_OPTIONS.map((day) => {
                        const isSelected = reminder.days_of_week.includes(
                          day.key,
                        );

                        return (
                          <span
                            key={day.key}
                            className={cn(
                              "grid size-8 place-items-center rounded-full border text-xs font-semibold",
                              isSelected && !reminder.is_disabled
                                ? "border-primary/40 bg-[color-mix(in_srgb,var(--primary)_42%,var(--card))] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-none"
                                : "border-foreground/10 bg-transparent text-muted-foreground",
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
                </FluidWaveItem>
              ))}
            </div>
          )}
        </PageContent>
      ) : (
        <RemindersManagementPageSkeleton />
      )}

      <ReminderDialog {...dialog} />
    </div>
  );
}

export default RemindersManagementPage;
